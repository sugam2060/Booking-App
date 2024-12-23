import { test, expect } from '@playwright/test';
import path from 'path';



const UI_URL = "http://localhost:5173/"



test.beforeEach(async ({page})=>{
    
      await page.goto(UI_URL)
      await page.getByRole('link',{name:'Sign in'}).click();
      await expect(page.getByRole('heading',{name:'Sign In'})).toBeVisible();
    
      await page.locator('[name=email]').fill('sugampudasain3@gmail.com');
      await page.locator('[name=password]').fill('sugam123');
    
      await page.getByRole('button',{name:'Login'}).click();
    
      await expect(page.getByText('Login successfull')).toBeVisible()
})


test('should allow user to add a hotel',async({page})=>{
    await page.goto(`${UI_URL}add-hotel`)

    await page.locator('[name="name"]').fill('test hotel');
    await page.locator('[name="city"]').fill('test city');
    await page.locator('[name="country"]').fill('test country');

    await page.locator('[name="description"]').fill('test description');

    await page.locator('[name="pricePerNight"]').fill('1000');

    await page.selectOption('select[name="starRating"]',"3")

    await page.getByText("Budget").click()

    await page.getByLabel("Free Wifi").check()
    await page.getByLabel("Parking").check()

    await page.locator('[name="adultCount"]').fill("2")
    await page.locator('[name="childCount"]').fill("4")

    await page.setInputFiles('[name="imageFiles"]',[
        path.join(__dirname,"files","1.jpeg"),
        path.join(__dirname,"files","2.jpg")
    ])


    await page.getByRole('button',{name:"Save"}).click();

    await expect(page.getByText("Saved")).toBeVisible();
})
