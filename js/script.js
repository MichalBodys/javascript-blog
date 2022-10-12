'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tagCloud-link').innerHTML),
  authorSideLink: Handlebars.compile(document.querySelector('#template-authorSide-link').innerHTML),
};

const opts = {
  ArticleSelector: '.post',
  TitleSelector: '.post-title',
  TitleListSelector:'.titles',
  ArticleTagsSelector: '.post-tags .list',
  ArticleAuthorSelector: '.post-author',
  TagsListSelector: '.list.tags',
  CloudClassCount: 5,
  CloudClassPrefix: 'tag-size-',
  AuthorsListSelector: '.list.authors'
};

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;

  /* remove class 'active' from all article links */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('article.active');
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}




function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(opts.TitleListSelector);
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(opts.ArticleSelector + customSelector);
  console.log('customSelector:' + customSelector);

  let html = '';

  for (let article of articles) {

    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(opts.TitleSelector).innerHTML;

    /* create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    /* insert link into html variable */
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();

function calculateTagsParams(tags) {
  const params = {min: 99999, max:0};
  for (let tag in tags) {
    if(tags[tag] > params.max) {
      params.max = tags[tag];
    } else if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}
function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opts.CloudClassCount - 1) + 1);
  return opts.CloudClassPrefix + classNumber;
}

function generateTags(){
  let allTags = {};
  // new variable allTags with epmy array

  /* find all articles */
  const articles = document.querySelectorAll(opts.ArticleSelector);

  /* START LOOP: for every article: */
  for (let article of articles) {

    /* find tags wrapper */
    const tagsWrapper = article.querySelector(opts.ArticleTagsSelector);
    tagsWrapper.innerHTML='';
    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){

      /* generate HTML of the link */

      const tagHTMLData = {id: tag, tagName: tag};
      const linkHTML = templates.tagLink(tagHTMLData);
      /* add generated code to html variable */
      html = html + '  ' + linkHTML;

      if(!allTags.hasOwnProperty(tag)){
        allTags[tag]= 1;
      }else{
        allTags[tag]++;
      }

      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
    /* END LOOP: for every article: */
  }
  const tagList = document.querySelector(opts.TagsListSelector);
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);
  const allTagsData = {tags: []};

  for(let tag in allTags){

    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData);
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
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for (let activeTag of activeTags) {

    /* remove class active */
    activeTag.classList.remove('active');

  /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (let tagLink of tagLinks) {

    /* add class active */
    tagLink.classList.add('active');

  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){

  /* find all links to tags */
  const allTagLinks = document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */
  for (let allTagLink of allTagLinks) {

    /* add tagClickHandler as event listener for that link */
    allTagLink.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}
addClickListenersToTags();




function generateAuthors(){

  const allAuthors = {};


  /* find all articles */
  const articles = document.querySelectorAll(opts.ArticleSelector);


  /* START LOOP: for every article: */
  for (let article of articles) {


    /* find authors wrapper */
    const authorsWrapper = article.querySelector(opts.ArticleAuthorSelector);

    /* make html variable with empty string */
    let html = '';

    /* get author from data-author attribute */
    const author = article.getAttribute('data-author');

    /* generate HTML of the link */

    const authorHTMLData = {id: author, authorName: author};
    const linkHTML = templates.authorLink(authorHTMLData);
    /* add generated code to html variable */
    html = html + linkHTML;

    if(!allAuthors.hasOwnProperty(author)) {
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }

    /* END LOOP: for each tag */
    authorsWrapper.innerHTML = html;
  }
  const authorsList = document.querySelector(opts.AuthorsListSelector);

  const allAuthorsData = {authors: []};

  for (let author in allAuthors) {
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
    });
  }

  authorsList.innerHTML = templates.authorSideLink(allAuthorsData);
}
generateAuthors();


function authorClickHandler(event){

  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');


  /* make a new constant "hrefAuthor" and extract tag from the "href" constant */
  const author = href.replace('#author-', '');


  /* find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

  /* START LOOP: for each active tag link */
  for (let activeAuthorLink of activeAuthorLinks) {

    /* remove class active */
    activeAuthorLink.classList.remove('active');

  /* END LOOP: for each active tag link */
  }

  /* find all author links with "href" attribute equal to the "href" constant */
  const authorsLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (let authorLink of authorsLinks) {

    /* add class active */
    authorLink.classList.add('active');

  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors(){

  /* find all links to tags */
  const allAuthorLinks = document.querySelectorAll('a[href^="#author-"]');

  /* START LOOP: for each link */
  for (let allAuthorLink of allAuthorLinks) {

    /* add authorClickHandler as event listener for that link */
    allAuthorLink.addEventListener('click', authorClickHandler);
  /* END LOOP: for each link */
  }
}
addClickListenersToAuthors();