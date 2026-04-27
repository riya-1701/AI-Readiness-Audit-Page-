import axios from "axios";
import * as cheerio from "cheerio";


export async function analyzeURL(url){
console.log("analyzeURL function called");
    let html;
//fetch url
try{
    const response = await axios.get(url,{
        timeout:10000,
        headers:{
            'User-Agent': 'Mozilla/5.0 (compatible; AIAuditBot/1.0)',
        }
    });
    html = response.data;
}catch(err){
    //if not fetched throw error
    throw new Error('Could not fetch the URL. Make sure it is valid and publicly accessible.')
}
//2. load html into cheerio so tht we can query it like jQuery
const $ = cheerio.load(html);

//Run each check. every checks returns an object: pass: true/false, issue: description, points:HOW MUCH THIS CHECK IS WORTH IT
const checks = [];

//check1: does this page have meta description?
const metaDesc = $('meta[name="description"]').attr("content");
if(metaDesc && metaDesc.length>50){
    checks.push({passed: true, points: 20});
} else{
    checks.push({
        passed: false,
        points: metaDesc && metaDesc.length<50 && metaDesc.length>20 ? 5 : 0 ,
        issue: {
            title: 'Missing or Weak Meta Description',
            detail: 'Your page has no meta description (or maybe it is too short). AI crawlers use this to understand page context quickly.',
            severity: 'High',
        }
    })
}

//check2: does page have proper heading structures h1 , h2
const h1Count = $('h1').length;
const h2Count = $('h2').length;
if(h1Count==1 && h2Count>=2){
    checks.push({passed: true, points: 20})}
    else{
        checks.push({
            passed: false,
            points: h1Count ===0 ? 0 : 5,
            issue: {
        title: 'Unorganized or Weak Heading Structure',
        detail: `Found ${h1Count} H1 tags and ${h2Count} H2 tags. A good page has exactly 1 H1 and multiple H2s for AI tools to increase its readability.`,
        severity: h1Count === 0 ? 'High' : 'Medium',
            }
        })
    }

//check 3: do page has good amount of text
 const paragraphs = $('p');
  let totalTextLength = 0;
  paragraphs.each((_, el) => {
    totalTextLength += $(el).text().trim().length;
  });

  if (totalTextLength > 500) {
    checks.push({ passed: true, points: 20 });
  } else {
    checks.push({
      passed: false,
      points: totalTextLength > 200 ? 10 : 0,
      issue: {
        title: 'Minimal text content',
        detail: `This page has ~${totalTextLength} characters of paragraph text. AI needs sufficient content to understand!`,
        severity: 'Medium',
      },
    });
  }

//check 4: does this page have alt text to define images
const images = $('img');
let validImageCount = 0;
images.each((_, el) => {
  const src = $(el).attr('src');
  const alt = $(el).attr('alt');
  if (src && alt && alt.trim().length > 0) {
    validImageCount++;
  }
});
if (validImageCount >= 1) {
  checks.push({ passed: true, points: 20 });
} else {
  checks.push({
    passed: false,
    points: images.length > 0 ? 5 : 0, // partial credit if images exist but lack alt text
    issue: {
      title: 'No images or missing alt text',
      detail: `Found ${images.length} image(s) with ${validImageCount} alt text. Always describe your images with alt tags. Images without context is useless for AI`,
      severity: images.length === 0 ? 'High' : 'Medium',
    },
  });
}

//check 5: check for FAQs
const bodyText = $('body').text().toLowerCase();
const hasFAQ=
bodyText.includes('frequently asked') || bodyText.includes('faq') 
if(hasFAQ){
    checks.push({passed: true, points: 20})
}else{
    checks.push({
        passed: false,
        points: 0,
        issue:{
            title: "No FAQs Found",
            detail: "A website must have FAQS for AI to understand it better and also for smooth user experience.",
            severity: "High"
        },
    })
}


//Now calculate SCORE out oof 100
console.log(checks);
const score = checks.reduce((total, check) => total + check.points, 0);

// Step 5: Collect only the failed checks as "issues" to show the user
  const issues = checks.filter((c) => !c.passed).map((c) => c.issue);

  return { score, issues };

}
export default analyzeURL;