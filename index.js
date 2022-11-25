const puppeteer=require('puppeteer')
const fs=require('fs')

async function run(){
    //launch browser 
    const browser= await puppeteer.launch();
    //to access page initize  variable and wait till page opens
    const page=await browser.newPage();
    //to go to particular page wait till not land on that page
    await page.goto('https://www.traversymedia.com');


//  ACTIONS ----WEB SCRAPING

       //to take screenshot and save as 'home.png' (for full page set fullpage:true)
   await page.screenshot({ path: "home.png", fullPage: true });
   //to save that page as pdf as 'homePage.pdf' (for format:'A4')
   await page.pdf({ path: "homePage.pdf", format: "A4" });
   //to get whole 'html' of webpage in console
   const html = await page.content();
   console.log(html);
   //to get "title" of webpage ---use 'evaluate' a higher order fn i.e taking fn. as arg
   const title = await page.evaluate(() => document.title);
   console.log(title);
   //to get all the innerHtml of a page from doucument body object
   const innerText = await page.evaluate(() => document.body.innerText);
   console.log(innerText);
   //to get all the links of the page using queryselector all and wrapping in array
   const links = await page.evaluate(() => Array.from(document.querySelectorAll("a"), (e) => e.href));
   console.log(links);


//  SOME EXAMPLES OF ACCESSING THE PAGE ELEMENTS VIEW STRUCTURE OF PAGE FIRST 

    //        //say there are cources cards having course name,code,link pic etc 
    //        const coursesList=await page.evaluate(()=>
    //        Array.from(document.querySelectorAll('#courses .card'), (e)=> ({
    //                //accessing all the course titles in object array form------
    //            CourseTitle: e.querySelector('.card-body h3').innerText,
    //                //accessing all the course levels in object array form------
    //            CourseLevel: e.querySelector('.card-body .level').innerText,
    //                //accessing all the course links in object array form------
    //            CourseURL: e.querySelector('.card-footer a').href,
    //                //accessing all the course promocodes in object array form------
    //            CoursePromoCode: e.querySelector('.card-footer .promo-code .promo').innerText
    //            })));
    //        console.log(coursesList) 

//  DOING ABOVE USING METHOD OTHER THAN 'Array.from()' using map i.e inplace of line 35,36
        const coursesList=await page.$$eval('#courses .card', (e)=>e.map((e)=>({
            CourseTitle: e.querySelector('.card-body h3').innerText,
            CourseLevel: e.querySelector('.card-body .level').innerText,
            CourseURL: e.querySelector('.card-footer a').href,
            CoursePromoCode: e.querySelector('.card-footer .promo-code .promo').innerText
        })) );
        // console.log(coursesList)
                //save to json
        fs.writeFile('coursesList.json', JSON.stringify(coursesList),(err)=>{
            if(err) throw err;
            console.log('File saved!');
        });


    //close browser
    await browser.close();
}
run();