import asyncio
import urllib.request
from playwright.async_api import async_playwright

async def run_auth_test():
    print("Downloading logo...")
    logo_url = "https://res.cloudinary.com/dlxveseav/image/upload/v1787321560/Super_Player_Auction/sv84zvup4ylrdi1fyalk.png"
    logo_path = "logo.png"
    urllib.request.urlretrieve(logo_url, logo_path)
    print("Logo downloaded.")

    print("Starting browser...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, slow_mo=500)
        page = await browser.new_page()

        try:
            print("Navigating to Authentication...")
            # We'll use the localhost for reliable testing, or stick to aotms.com if preferred
            # But since it failed on waiting, let's just use the direct URL
            await page.goto("http://192.168.18.1:8081/")
            
            # They requested login first. Wait for Sign In tab (default)
            print("Entering email: ameen@gmail.com")
            # Fill the email input
            await page.fill("input[name='email']", "ameen@gmail.com")

            print("Entering password...")
            # Fill the password input
            await page.fill("input[name='password']", "Ameen@2026")

            print("Clicking 'Sign In' button...")
            # Click the submit button on the Sign In form
            await page.click("button[type='submit']")

            print("Waiting for login to complete (URL change)...")
            try:
                await page.wait_for_url("**/my-auctions**", timeout=10000)
                print("Login successful, redirected to my-auctions.")
            except Exception:
                print("Did not redirect to my-auctions. Trying to go to /my-auctions/new anyway...")

            print("Navigating to Create Auction...")
            await page.goto("https://www.aotms.com/my-auctions/new")
            
            print("Waiting for Auction Form to load...")
            await page.wait_for_selector("input#coverImage", timeout=15000)

            print("Uploading cover image...")
            # Set the cover image file input
            await page.set_input_files("input#coverImage", logo_path)
            
            print("Entering auction name...")
            await page.fill("input[name='name']", "AOTMS Super Auction")
            
            print("Submitting auction...")
            # Since there's a button with text "Create Auction"
            await page.click("button[type='submit']")

            print("Waiting for creation to finish...")
            await page.wait_for_timeout(5000)
            print("Process completed successfully!")
            
        except Exception as e:
            print(f"An error occurred: {e}")
            await page.screenshot(path="error_screenshot.png")
            print("Saved error screenshot to error_screenshot.png")
            
        finally:
            print("Keeping browser open for 10 seconds to view...")
            await page.wait_for_timeout(10000)
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run_auth_test())
