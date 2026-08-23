import asyncio
import urllib.request
import random
import os
from playwright.async_api import async_playwright

TEAM_LOGOS = [
    "https://res.cloudinary.com/dlxveseav/image/upload/v1787290746/Super_Player_Auction/auction/1787218603_42969.png",
    "https://res.cloudinary.com/dlxveseav/image/upload/v1787290746/Super_Player_Auction/auction/1787134529_75670.png",
    "https://res.cloudinary.com/dlxveseav/image/upload/v1787290745/Super_Player_Auction/auction/1787119985_90979.png",
    "https://res.cloudinary.com/dlxveseav/image/upload/v1787290744/Super_Player_Auction/auction/1786872568_59648.png",
    "https://res.cloudinary.com/dlxveseav/image/upload/v1787290744/Super_Player_Auction/auction/1787035256_90188.png",
    "https://res.cloudinary.com/dlxveseav/image/upload/v1787290744/Super_Player_Auction/auction/1786960954876-747834360.png",
    "https://res.cloudinary.com/dlxveseav/image/upload/v1787290743/Super_Player_Auction/auction/1786723063_77738.png",
    "https://res.cloudinary.com/dlxveseav/image/upload/v1787290743/Super_Player_Auction/auction/1786644020011-666815170.png"
]

TEAM_NAMES = ["Super Kings", "Royal Challengers", "Knight Riders", "Sunrisers", "Capitals", "Indians", "Titans", "Super Giants", "Warriors", "Strikers"]
SHORT_NAMES = ["CSK", "RCB", "KKR", "SRH", "DC", "MI", "GT", "LSG", "WAR", "STR"]
COLORS = ["#FFD700", "#FF0000", "#3A225D", "#FF822A", "#0000FF", "#004BA0", "#1B2133", "#00AEEF", "#333333", "#00FF00"]
OWNERS = ["John Doe", "Jane Smith", "Bob Builder", "Alice Wonderland", "Sam Spade", "Bruce Wayne", "Clark Kent", "Peter Parker"]
PHONES = ["9876543210", "9998887776", "9123456780", "9988776655", "9012345678", "9876501234", "9999999999", "9888888888"]

async def run_teams_test():
    print("Downloading logos...")
    os.makedirs("logos", exist_ok=True)
    local_logos = []
    for i, url in enumerate(TEAM_LOGOS):
        path = f"logos/team_{i+1}.png"
        urllib.request.urlretrieve(url, path)
        local_logos.append(path)
    print("Logos downloaded.")

    print("Starting browser...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, slow_mo=300)
        page = await browser.new_page()

        try:
            print("Navigating to Authentication...")
            await page.goto("https://www.aotms.com/auth")
            
            print("Logging in...")
            await page.fill("input[name='email']", "ameen@gmail.com")
            await page.fill("input[name='password']", "Ameen@2026")
            await page.click("button[type='submit']")

            print("Waiting for login to complete (URL change)...")
            try:
                await page.wait_for_url("**/my-auctions**", timeout=10000)
                print("Login successful, redirected to my-auctions.")
            except Exception:
                print("Did not redirect to my-auctions, forcing navigation...")
                await page.goto("https://www.aotms.com/my-auctions")
            
            print("Selecting the first auction...")
            # Click the first auction link (not the 'new' button)
            await page.click("a[href*='/my-auctions/']:not([href='/my-auctions/new'])")
            
            # Wait for teams page to load (which is the default tab)
            print("Waiting for auction page...")
            await page.wait_for_selector("text=Teams", timeout=10000)
            
            # Give it a moment to render the floating action button
            await page.wait_for_timeout(2000)
            
            for i, logo_path in enumerate(local_logos):
                print(f"\nCreating Team {i+1}/8...")
                # Click the Add Team button (plus icon at bottom right)
                # Using force=True because a success toast from the previous team might overlap the button
                await page.click("button.rounded-full.shadow-lg", force=True)
                
                # Wait for modal
                await page.wait_for_selector("text=Add New Team", timeout=10000)
                
                # Upload logo
                await page.set_input_files("input#logo", logo_path)
                
                # Randomly pick details
                t_name = random.choice(TEAM_NAMES) + f" {random.randint(10,99)}"
                s_name = random.choice(SHORT_NAMES) + str(random.randint(1,9))
                owner = random.choice(OWNERS)
                phone = random.choice(PHONES)
                color = random.choice(COLORS)
                
                await page.fill("input#name", t_name)
                await page.fill("input#shortName", s_name)
                await page.fill("input#ownerName", owner)
                await page.fill("input#ownerPhone", phone)
                await page.fill("input#colorTheme", color)
                
                # Submit
                await page.click("button:has-text('Save Team')")
                
                # Wait for dialog to close
                await page.wait_for_selector("text=Add New Team", state="detached", timeout=10000)
                print(f"Team '{t_name}' created successfully!")
                
                # Slight pause between creations
                await page.wait_for_timeout(500)

            print("\nAll 8 teams created successfully!")
            
        except Exception as e:
            print(f"An error occurred: {e}")
            await page.screenshot(path="team_error_screenshot.png")
            print("Saved error screenshot to team_error_screenshot.png")
            
        finally:
            print("Keeping browser open for 10 seconds to view...")
            await page.wait_for_timeout(10000)
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run_teams_test())
