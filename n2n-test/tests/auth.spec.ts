import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:5173/"

const testEmail = `testEmail${Math.floor(Math.random() *90000)+10000}@test.com`

test('should allow user to sign up', async ({ page }) => {
  await page.goto(UI_URL)
  //get the sign up button

  await page.getByRole('link',{name:"sign up"}).click();

  await expect(page.getByRole('heading',{name:'Create an Account'})).toBeVisible()

  await page.locator("[name=firstName]").fill('dummyfName');
  await page.locator("[name=lastName]").fill('dummyLname')
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill('password')
  await page.locator("[name=confirmPassword]").fill('password')


  await page.getByRole("button",{name:"create Account"}).click()

  await expect(page.getByRole('button',{name:"submit otp"})).toBeVisible()


  await page.keyboard.type('234123');


  await page.getByRole('button',{name:'submit otp'}).click()

  await expect(page.getByText("Registered successfully")).toBeVisible()
  
  await expect(page.getByRole("link",{name: "My Booking"})).toBeVisible()
  await expect(page.getByRole("link",{name: "My Hotels"})).toBeVisible()
  await expect(page.getByRole("button",{name: "Sign out"})).toBeVisible()


});


test('should allow user to sign in', async ({page}) => {
  await page.goto(UI_URL)
  await page.getByRole('link',{name:'Sign in'}).click();
  await expect(page.getByRole('heading',{name:'Sign In'})).toBeVisible();

  await page.locator('[name=email]').fill(testEmail);
  await page.locator('[name=password]').fill('password');

  await page.getByRole('button',{name:'Login'}).click();

  await expect(page.getByText('Login successfull')).toBeVisible()

  await expect(page.getByRole("link",{name: "My Booking"})).toBeVisible()
  await expect(page.getByRole("link",{name: "My Hotels"})).toBeVisible()
  await expect(page.getByRole("button",{name: "Sign out"})).toBeVisible()
  
})


test('redirect to create an an account',async ({page})=>{
  await page.goto(UI_URL)

  await page.getByRole('link',{name:'Sign in'}).click();
  await page.getByRole('link',{name: 'Create an account here'}).click();
  await expect(page.getByRole('heading',{name: 'Create an Account'})).toBeVisible();

})