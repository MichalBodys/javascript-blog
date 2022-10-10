'use strict';

const optArticleSelector = '.post',
  optTitleSelector ='.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optAuthorLinksSelectByParam = 'a[href^="#author-"]',
  optAuthorLinksSelectedByParamWithCActive = 'a.active[href^="#author-"]';

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {activeLink.classList.remove('active');

  }
  /* [Done] add class 'active' to the clicked link */

  clickedElement.classList.add('active');

  console.log('clickedElement:', clickedElement);

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.posts  article.active');

  for (let activeArticle of activeArticles) {activeArticle.classList.remove('active');

  }
  /* [DONE]get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');

  /* [DONE]find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);


  /* add class 'active' to the correct article */

  targetArticle.classList.add('active');
}



function generateTitleLinks(customSelector = ''){

  /* [Done]remove contents of titleList */

  const titleList = document.querySelector(optTitleListSelector);

  /* for each article */

  const articles = document.querySelectorAll(optArticleSelector + customSelector);


  let html = '';

  for (let article of articles) {

    /* get the article id */

    const articleId = article.getAttribute('id');

    /* find the title element */

    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* get the title from the title element */

    /* create HTML of the link */

    const linkHTML = `<li><a href="#${articleId}"><span>${articleTitle}</span></a></ali>`;

    /* insert link into titleList */

    html = html + linkHTML;
  }

  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');

  for (let link of links) {

    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();

function generateTags(){
  /* find all articles */

  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */

  for(let article of articles){

    /* find tags wrapper*/
    const tagList = article.querySelector(optArticleTagsSelector);

    /* make html variable with empty string */

    let html = '';

    /* get tags from data-tags attribute */

    const articleTags = article.getAttribute('data-tags');

    /* split tags into array */

    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */

    for(let tag of articleTagsArray){

      /* generate HTML of the link */

      const tagHTML = `<li><a href="#tag-${tag}">${tag}</a></li>`;


      /* add generated code to html variable */

      html = html +  tagHTML;

      /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */

    tagList.innerHTML = html;

    /* END LOOP: for every article: */
  }
}


generateTags();


function tagClickHandler(event){

  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */

  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */

  for(let activeTagLink of activeTagLinks){

    /* remove class active */

    activeTagLink.classList.remove('active');

  /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */

  const tagLinks = document.querySelectorAll('a[href="'+ href +'"]');

  /* START LOOP: for each found tag link */

  for(let tagLink of tagLinks){

    /* add class active */

    tagLink.classList.add('active');

    /* END LOOP: for each found tag link */

  }
  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){

  /* find all links to tags */

  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */

  for(let tagLink of tagLinks){

    /* add tagClickHandler as event listener for that link */

    tagLink.addEventListener('click', tagClickHandler);

  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors(){

  const articles = document.querySelectorAll(optArticleSelector);

  for(let article of articles){

    const authorList = article.querySelector(optArticleAuthorSelector);

    let html = '';

    const authorTag = article.getAttribute('data-author');

    const authorHTML = `<a href="#${authorTag}">${authorTag}</a>`;

    html = html + authorHTML;

    authorList.innerHTML = html;
  }
}
generateAuthors();

function authorClickHandler(event) {
  event.preventDefault();

  const clickedElement = this;

  const href = clickedElement.getAttribute('href');

  const author = href.replace('#author-', ' ');

  const activeAuthorLinks = document.querySelectorAll(optAuthorLinksSelectedByParamWithCActive);

  for(let activeAuthorLink of activeAuthorLinks){

    activeAuthorLink.classList.remove('active');
  }
  const authorLinks = document.querySelectorAll('a[href="'+ href +'"]');

  for(let authorLink of authorLinks){
    authorLink.classList.add('active');
  }

  generateTitleLinks('[data-author="' + author + '"]');
}



function addClickListenersToAuthors(){

  const authorLinks = document.querySelectorAll(optAuthorLinksSelectByParam);

  for(let authorLink of authorLinks){

    authorLink.addEventListener('click', authorClickHandler);
  }
}
addClickListenersToAuthors();