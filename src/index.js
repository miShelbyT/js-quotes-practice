/**********DOM Elements**********/
const quoteList = document.querySelector("#quote-list")
// console.log(quoteList)

const newQuoteForm = document.querySelector("#new-quote-form")
// console.log(newQuoteForm)


/**********Event Handlers**********/
function createQuote(event) {
  event.preventDefault()

  const newQuote = {
    "quote": event.target.quote.value,
    "author": event.target.author.value
  }

  event.target.reset()

  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(newQuote),
  })
    .then(response => response.json())
    .then(newQuote => renderEachQuote(newQuote))
}

// create DELETE request to update db

function deleteQuote(event) {
  if (event.target.matches(".btn-danger")) {
    const dBtn = event.target
    const quoteCard = dBtn.closest("li")
    const id = quoteCard.dataset.id
    quoteCard.remove()

    fetch(`http://localhost:3000/quotes/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => console.log(data))
  }

}

function addLikes(event) {
  if (event.target.matches(".btn-success")) {
    likeBtn = event.target
    likes = likeBtn.querySelector("span")
    newLikes = parseInt(likes.textContent) + 1
    likes.textContent = newLikes

    const quoteCard = likeBtn.closest("li")
    const id = parseInt(quoteCard.dataset.id)
    fetch(`http://localhost:3000/likes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quoteId: id }),
    })
      .then(response => response.json())
      .then(console.log)
  }

}



/**********Event Listeners**********/

newQuoteForm.addEventListener("submit", createQuote)

quoteList.addEventListener("click", deleteQuote)

quoteList.addEventListener("click", addLikes)


/*********Render Functions***********/


function renderEachQuote(quote) {
  const li = document.createElement("li")
  li.classList.add("quote-card")
  li.dataset.id = quote.id
  let likes;

  if(quote.likes){
    likes = quote.likes.length
  } else likes = 0

  li.innerHTML = `
	<blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${likes}</span></button>
      <button class='btn-danger'>Delete</button>
		</blockquote>`

  quoteList.append(li)

}

const renderAllQuotes = (quotes) => {
  quotes.forEach(renderEachQuote)
}




/*********Initial Render***********/



function initialize() {

  fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(quoteArray => renderAllQuotes(quoteArray));

}

initialize()