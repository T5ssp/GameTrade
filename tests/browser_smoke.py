"""Browser acceptance checks for the restaurant website.

Run with: python3 tests/browser_smoke.py
Serves only the local repository on an ephemeral loopback port. No Git actions.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import re
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = Path('/tmp/future-v2-validation')
ARTIFACTS.mkdir(exist_ok=True)


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def price(value):
    return float(re.search(r'\d+(?:\.\d+)?', value).group())


def attach_errors(page, errors):
    page.on('pageerror', lambda error: errors.append(str(error)))
    # External fonts are optional; acceptance checks must not depend on the Internet.
    page.route('https://**/*', lambda route: route.abort())


def main():
    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT)))
    Thread(target=server.serve_forever, daemon=True).start()
    url = f'http://127.0.0.1:{server.server_port}/'
    checks = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
            context = browser.new_context(viewport={'width':1280, 'height':1000}, accept_downloads=True)
            page = context.new_page()
            errors = []
            attach_errors(page, errors)
            response = page.goto(url, wait_until='domcontentloaded')
            assert response.status == 200
            expect(page.locator('.dish')).to_have_count(13)
            assert page.locator('html').get_attribute('lang') == 'en'
            expect(page.locator('#menuQR')).to_have_attribute('src', re.compile(r'^data:image/svg\+xml'))
            checks.append('English menu and live local QR')

            # Saved dishes work with search/filters and survive refresh.
            page.locator('[data-favorite="salmon"]').click()
            expect(page.locator('[data-favorite="salmon"]')).to_have_attribute('aria-pressed','true')
            page.locator('#favoritesOnly').click()
            expect(page.locator('.dish')).to_have_count(1)
            expect(page.locator('.dish h4')).to_have_text('Grilled Salmon')
            page.reload(wait_until='domcontentloaded')
            expect(page.locator('[data-favorite="salmon"]')).to_have_attribute('aria-pressed','true')
            # Filter view may reset to all on refresh; use aria-pressed to normalize.
            if page.locator('#favoritesOnly').get_attribute('aria-pressed') == 'true':
                page.locator('#favoritesOnly').click()
            expect(page.locator('.dish')).to_have_count(13)
            checks.append('favorites toggle and storage persistence')

            page.locator('[data-diet="plant"]').click()
            names = page.locator('.dish h4').all_text_contents()
            assert 'Vegetable Bowl' in names and 'Quinoa Salad' in names
            assert 'Grilled Salmon' not in names and 'Beef Steak' not in names
            page.locator('[data-diet="vegetarian"]').click()
            assert 'Grilled Salmon' not in page.locator('.dish h4').all_text_contents()
            page.locator('[data-diet="all"]').click()
            expect(page.locator('.dish')).to_have_count(13)
            for option, reverse in [('price-asc',False),('price-desc',True)]:
                page.locator('#sortMenu').select_option(option)
                # If the menu is grouped, every category must honor the selected order.
                for group in page.locator('.dish-grid').all():
                    prices = [price(t) for t in group.locator('.price').all_text_contents()]
                    assert prices == sorted(prices, reverse=reverse), prices
            page.locator('#sortMenu').select_option('featured')
            page.locator('#search').fill('unfindable-dish-123')
            expect(page.locator('.dish')).to_have_count(0)
            expect(page.locator('#empty')).to_be_visible()
            page.locator('#resetSearch').click()
            expect(page.locator('.dish')).to_have_count(13)
            checks.append('plant/vegetarian filters, price sorting and empty search')

            # Two customized salmon portions: (4.500 + 0.600) x 2.
            page.locator('[data-detail="salmon"]').click()
            expect(page.locator('#detailDialog')).to_be_visible()
            expect(page.locator('#customizeForm')).to_be_visible()
            page.locator('[data-detail-quantity="1"]').click()
            page.locator('input[name="addon"][value="quinoa"]').check()
            note = 'No salt <img src=x onerror="window.__itemInjected=1">'
            page.locator('#itemNote').fill(note)
            expect(page.locator('#detailTotal')).to_have_text('OMR 10.200')
            page.locator('#addCustomized').click()
            expect(page.locator('#detailDialog')).not_to_be_visible()
            expect(page.locator('#count')).to_have_text('2')
            page.locator('#cartOpen').click()
            expect(page.locator('#cartItems .cart-item')).to_have_count(1)
            expect(page.locator('#total')).to_have_text('OMR 10.200')
            assert note in page.locator('#cartItems').inner_text()
            assert page.evaluate('window.__itemInjected') is None
            assert page.locator('#cartItems img[src="x"]').count() == 0
            checks.append('customization, quantity, add-on arithmetic and safe item notes')

            # Editing a line adjusts the same line; another quick-add remains separate.
            page.locator('[data-edit-line]').first.click()
            expect(page.locator('#detailDialog')).to_be_visible()
            page.locator('[data-detail-quantity="-1"]').click()
            page.locator('#addCustomized').click()
            expect(page.locator('#cartItems .cart-item')).to_have_count(1)
            expect(page.locator('#total')).to_have_text('OMR 5.100')
            page.locator('#cartClose').click()
            page.locator('[data-add="salmon"]').click()
            page.locator('#cartOpen').click()
            expect(page.locator('#cartItems .cart-item')).to_have_count(2)
            expect(page.locator('#total')).to_have_text('OMR 9.600')
            page.locator('[data-remove-line]').last.click()
            expect(page.locator('#cartItems .cart-item')).to_have_count(1)
            expect(page.locator('#total')).to_have_text('OMR 5.100')
            page.locator('[data-change-line][data-delta="1"]').first.click()
            expect(page.locator('#total')).to_have_text('OMR 10.200')
            page.locator('[data-change-line][data-delta="-1"]').first.click()
            expect(page.locator('#total')).to_have_text('OMR 5.100')
            checks.append('edit/remove independent customized cart lines')

            page.locator('#checkout').click()
            expect(page.locator('#orderError')).to_contain_text(re.compile(r'name',re.I))
            name = 'Alex <img src=x onerror="window.__nameInjected=1">'
            kitchen = 'Please keep the sauce separate <script>window.__notesInjected=1</script>'
            page.locator('#customerName').fill(name)
            page.locator('#notes').fill(kitchen)
            page.locator('#service').select_option('pickup')
            expect(page.locator('#tableLabel')).not_to_be_visible()
            page.locator('#service').select_option('table')
            page.locator('#table').select_option('7')
            page.locator('#checkout').click()
            expect(page.locator('#tracking')).to_be_visible()
            assert name in page.locator('#tracking').inner_text()
            assert kitchen in page.locator('#tracking').inner_text()
            assert page.evaluate('window.__nameInjected || window.__notesInjected || null') is None
            page.reload(wait_until='domcontentloaded')
            page.locator('#cartOpen').click()
            expect(page.locator('#tracking')).to_be_visible()
            expect(page.locator('#newOrder')).to_be_visible(timeout=16000)
            expect(page.locator('#count')).to_have_text('0')
            expect(page.locator('#downloadReceipt')).to_be_visible()
            with page.expect_download() as download_event:
                page.locator('#downloadReceipt').click()
            download = download_event.value
            receipt = ARTIFACTS / download.suggested_filename
            download.save_as(receipt)
            assert download.failure() is None
            receipt_text = receipt.read_text()
            assert 'NOT A PAYMENT RECEIPT' in receipt_text
            assert 'OMR 5.100' in receipt_text and 'Extra quinoa' in receipt_text
            checks.append('required name, safe checkout text, refresh-safe tracking and receipt download')

            page.locator('#newOrder').click()
            page.locator('#historyOpen').click()
            expect(page.locator('#infoDialog')).to_be_visible()
            expect(page.locator('.history-card')).to_have_count(1)
            expect(page.locator('.history-card')).to_contain_text('Grilled Salmon')
            page.locator('[data-reorder]').first.click()
            # Reorder may open the order drawer immediately or leave the menu visible.
            if page.locator('#infoDialog').is_visible():
                page.locator('#infoClose').click()
            if not page.locator('#cart').is_visible():
                page.locator('#cartOpen').click()
            expect(page.locator('#total')).to_have_text('OMR 5.100')
            expect(page.locator('#cartItems')).to_contain_text('Extra quinoa')
            expect(page.locator('#cartItems')).not_to_contain_text(note)
            page.locator('#cartClose').click()
            checks.append('local order history and customized reorder')

            page.set_viewport_size({'width':390, 'height':844})
            expect(page.locator('#mobileCartBar')).to_be_visible()
            page.locator('#mobileNavToggle').click()
            expect(page.locator('#mobileNavToggle')).to_have_attribute('aria-expanded','true')
            page.locator('[data-mobile-info="about"]').click()
            expect(page.locator('#infoDialog')).to_be_visible()
            page.locator('#infoClose').click()
            page.locator('#mobileNavToggle').click()
            page.keyboard.press('Escape')
            expect(page.locator('#mobileNavToggle')).to_have_attribute('aria-expanded','false')
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            page.screenshot(path=str(ARTIFACTS/'mobile.png'),full_page=True)
            page.set_viewport_size({'width':320, 'height':750})
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            page.set_viewport_size({'width':1280,'height':1000})
            page.screenshot(path=str(ARTIFACTS/'desktop.png'),full_page=True)
            page.locator('[data-detail="salmon"]').click()
            page.locator('input[name="addon"][value="quinoa"]').check()
            page.screenshot(path=str(ARTIFACTS/'customization.png'))
            page.locator('#detailClose').click()
            assert not errors, errors
            checks.append('mobile cart bar, 390px and 320px responsive widths, no JavaScript errors')
            context.close()

            # Two tabs must not replace each other's newly completed order history.
            multi = browser.new_context(viewport={'width':900,'height':1000})
            tabs = [multi.new_page(), multi.new_page()]
            multi_errors=[]
            for tab in tabs:
                attach_errors(tab,multi_errors)
                tab.goto(url,wait_until='domcontentloaded')
            for index,tab in enumerate(tabs):
                tab.locator('[data-add="salmon"]').click()
                tab.locator('#cartOpen').click()
                tab.locator('#customerName').fill(f'Table guest {index+1}')
                tab.locator('#checkout').click()
            for tab in tabs:
                expect(tab.locator('#newOrder')).to_be_visible(timeout=16000)
            tabs[-1].locator('#newOrder').click()
            tabs[-1].locator('#historyOpen').click()
            expect(tabs[-1].locator('.history-card')).to_have_count(2)
            assert not multi_errors, multi_errors
            checks.append('completed orders from two tabs merge into shared history')
            multi.close()

            # A visitor's original published-site cart must migrate without losing quantities.
            legacy = browser.new_context(viewport={'width':900,'height':1000})
            legacy.add_init_script("localStorage.setItem('future2060-cart', JSON.stringify({salmon:2,blue:1,unknown:7}));")
            legacy_page = legacy.new_page()
            legacy_errors=[]
            attach_errors(legacy_page,legacy_errors)
            legacy_page.goto(url,wait_until='domcontentloaded')
            expect(legacy_page.locator('#count')).to_have_text('3')
            legacy_page.locator('#cartOpen').click()
            expect(legacy_page.locator('#total')).to_have_text('OMR 10.500')
            expect(legacy_page.locator('#cartItems .cart-item')).to_have_count(2)
            assert not legacy_errors, legacy_errors
            checks.append('published cart migration preserves valid quantities')
            legacy_page.locator('.cart-item').filter(has_text='Blue Ocean').locator('[data-delta="-1"]').click()
            expect(legacy_page.locator('#cartItems .cart-item')).to_have_count(1)
            assert legacy_page.locator('#cart').evaluate('(el)=>el.contains(document.activeElement)')
            legacy_page.keyboard.press('Tab')
            assert legacy_page.locator('#cart').evaluate('(el)=>el.contains(document.activeElement)')
            checks.append('drawer keyboard focus stays contained when a quantity removes its item')
            legacy.close()

            # Storage can be denied by a browser; ordering must still work in memory.
            context = browser.new_context(viewport={'width':390,'height':844})
            context.add_init_script("""Object.defineProperty(window, 'localStorage', {get(){throw new DOMException('Blocked','SecurityError')}}); Object.defineProperty(window, 'sessionStorage', {get(){throw new DOMException('Blocked','SecurityError')}});""")
            storage_page = context.new_page()
            storage_errors=[]
            attach_errors(storage_page,storage_errors)
            storage_page.goto(url,wait_until='domcontentloaded')
            expect(storage_page.locator('.dish')).to_have_count(13)
            storage_page.locator('[data-add="salmon"]').click()
            storage_page.locator('#cartOpen').click()
            expect(storage_page.locator('#total')).to_have_text('OMR 4.500')
            assert not storage_errors, storage_errors
            checks.append('storage-denied graceful in-memory cart')
            context.close()
            browser.close()
    finally:
        server.shutdown()
    for check in checks:
        print('PASS:',check)
    print(f'PASS: {len(checks)} acceptance groups; artifacts at {ARTIFACTS}')


if __name__=='__main__':
    main()
