const studentList     = $(".student-item");
const totalStudents   = studentList.length;

function showPage(pageNum,list) {
  // first hide all students on the page
  studentList.hide();

  // clear/remove zero users error message
  $('#search-empty').remove();

  // check for presence of search searchResults
  // if present then replace list var with search results
  if($('#searchResults').val().length > 0){
    const searchReults = $('#searchResults').val();
    list = $(searchReults);
  }

  // determine student range
  const upper  = 10 * pageNum;
  const lower = upper - 10;

  // Ensure we have at least one result to display
  if(list.length > 0){
    // then loop through all students in our student list argument
    $.each(list,function(index, value){

      // increment index to negate array zero
      const current = index + 1;

      // add student name to their wrapper for search feature
      const sName = value.querySelector('h3').innerText;
      $(this).attr('id',sName.split(' ').join('-'));

      // if student should be on this page number
      if(current > lower && current <= upper){
        // show the student
        $(this).css('display','block');
      }

    });
  } else {
    // If no results are found then show a message alerting the user to this fact
    const searchQuery = $('#searchField').val().toLowerCase();
    $(".page-header").after(`<p id="search-empty">There are no students who match the search phrase "${searchQuery}".</p>`);
  }
}


function appendPageLinks(totalStudents) {

  // if pagination already exists, remove it in readiness for the update
  $('.pagination').remove();

  // determine how many pages for this student list
  const pages   = Math.ceil(totalStudents / 10);
  // create a page link section
  // "for" every page
  let linkHtml  = '';

  for (i = 0; i < pages; i++){
    const displayNum  = i + 1;

    // add the active class only for the first item
    const active      = (i<1) ? ' class="active"' : '';

    linkHtml  += `<li><a ${active} href="#">${displayNum}</a></li>`;
  }

  // add a page link to the page link section
  const pageLinkCont = $(`<div class="pagination"><ul><li>${linkHtml}</li></ul></div>`);

  // append our new page link section to the site if there are more than 1 page
  if(totalStudents>10){
    $(".page").append(pageLinkCont);
  }

  // define what happens when you click a link (event listener)
  $('.pagination a').on('click', function(event){
    event.preventDefault();
    // get number of clicked links
    const linkNum = $(this).text();

    // scroll to page top after click
    $('html, body').animate({
      scrollTop: 0
    }, 500);

    // Use showPage to display the page for the link clicked
    showPage(linkNum,studentList);

    // remove the active style from other links
    $('.active').removeClass('active');

    // mark this link as "active"
    $(this).addClass('active');

  });
}

function addSearch(){
  const searchHtml  = `<div class="student-search">
                        <input id="searchField" placeholder="Search for students...">
                        <button>Search</button>
                      </div>`;
  // add search to page
  $('.page-header').append(searchHtml);

  // add click handler
  $('.student-search button').on('click', function(e){
    // get search query
    const searchQuery = $('#searchField').val().toLowerCase();
    runSearch(searchQuery);
  });

 // If the user clicks enter instead of clicking the button
  $('#searchField').on('keyup', function(e){
    if (e.keyCode == 13) {
      // get search query
      const searchQuery = $('#searchField').val().toLowerCase();
      runSearch(searchQuery);
    }
  });

}

function runSearch(query){
  let results = "";
  let counter = 0;

  $.each(studentList,function(index, value){
    const studentName  = $(this).attr('id').toLowerCase();

    if(studentName.indexOf(query) >= 0){
      results += (counter >= 1) ? "," : "";
      const nameId = studentName.split(' ').join('-');
      results += '#'+nameId;
      counter++;
    }
  });

  // Add reset link
  if($('#reset').length < 1){
    $('.student-search').append('<a href="#" id="reset">reset</a>');
  }

  $("#reset").on('click',function(e){
    e.preventDefault();

    // Clear any stored search searchResults
    $('#searchResults, #searchField').val("");

    showPage(1,studentList);
    appendPageLinks(totalStudents);
    $('#reset').remove();
  });

  // store search results for paging
  $('#searchResults').val(results);

  const searchList = $(results);

  showPage(1,searchList);
  appendPageLinks(searchList.length);

}


showPage(1,studentList);
appendPageLinks(totalStudents);
addSearch();
