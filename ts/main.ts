/**
 * Represents a individual book that can be purchased
 */
class Book {
    /**
     *  The 13 digit ISBN number
     */
    isbn : string;

    /**
     *  The title of the book
     */
    title : string;

    /**
     *  The retail price of the book
     */
    price : number;

    /**
     *  The date the book was first published. This could
     *  be a future date, if the book is not yet released. 
     */
    releaseDate : Date;
}

/* // Book object test code
let myBook = new Book();
myBook.isbn = "123";
myBook.price = 9.99;
myBook.title = "Programming for beginners";
myBook.releaseDate = new Date(2023, 9, 8); // Months start at index 0

console.log(myBook); */


window.onload = function() {
        // Set up button click for add book form
        let addBookBtn = document.querySelector("#add-book") as HTMLButtonElement;
        addBookBtn.onclick = processBook;
}

function processBook() {
    console.log("processBook was called");

    let userBook = getBook();
    if (userBook != null) {
        addBook(userBook);
    }
}

/**
 * This function will retrieve all the book 
 * data from the HTML page. If all data is valid
 * a Book object will be returned. If any data
 * is invalid, null will be returned 
 * 
 */
function getBook():Book {
    clearAllErrorMessages();

    // Get all inputs
    let isbnTextBox = document.querySelector("#isbn") as HTMLInputElement;
    let titleTextBox = document.querySelector("#title") as HTMLInputElement;
    let priceTextBox = document.querySelector("#price") as HTMLInputElement;
    let releaseDateTextBox = document.querySelector("#release-date") as HTMLInputElement;

    // Validate data
    let isValidData:boolean = true;

    // Validate the ISBN
    let isbn = isbnTextBox.value;
    if (!isValidIsbn(isbn)) {
        isValidData = false;
        isbnTextBox.nextElementSibling.textContent = "ISBN must be 13 digits only";
    }

    // Validate title
    let title:string = titleTextBox.value;
    if (title.trim() == "") {
        isValidData = false;
        let titleErrorSpan = titleTextBox.nextElementSibling;
        titleErrorSpan.textContent = "You must provide a title";
    }


    // Validate price
    let price = parseFloat(priceTextBox.value);
    if (isNaN(price) || price < 0) {
        isValidData = false;
        priceTextBox.nextElementSibling.textContent = "Price must be a positive number";
    }

    // Validate release date
    let releaseDate = releaseDateTextBox.value;
    let releaseDateCheck = Date.parse(releaseDate); // If invalid, this will return NaN
    if (isNaN(releaseDateCheck)) {
        isValidData = false;
        releaseDateTextBox.nextElementSibling.textContent = "Release date must be a valid date";
    }

    if(isValidData) {
        // Create and populate Book object if all data is valid
        let addedBook = new Book();
        addedBook.isbn = isbn;
        addedBook.price = price;
        addedBook.title = title;

        // The value of the <input type="date"> is off by one day because of the time zone issues. This solution resolves the timezone issue.
        // Split date string into an array "2023-10-24"
        // Result would be {"2023", "10", "24"} index 0, 1, and 2. 2023 is the first element in the array.
        const dateParts:string[] = releaseDate.split("-"); // https://www.w3schools.com/jsref/jsref_split.asp 
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // subtract 1 because months are index based
        const day = parseInt(dateParts[2]);
        const correctDate = new Date(year, month, day);

        /* The split() method splits a string into an array of substrings. The split() method returns the new array.
        The split() method does not change the original string. If (" ") is used as separator, the string is split between words. */

        addedBook.releaseDate = correctDate; // this original line of code is the problem: addedBook.releaseDate = new Date(releaseDate);
                                             // we created all the above const's and used an array to fix 

        return addedBook;
    }
    return null; // Return null if any invalid data is present

}
/**
 * This validates an ISBN 13 number. Returns true
 * if the ISBN only consists of 13 digit characters
 * @param data The string to be validated
 * @returns True if data is a valid ISBN 13
 */
function isValidIsbn(data:string) {
    let regex = /^\d{13}$/;
    return regex.test(data);
}


/**
 * Adds a Book object to web page and to web storage. Assumes all data is valid
 * @param b The Book containing valid data to be added
 */
function addBook(b:Book):void {
    // alert("Data was valid, book added");
    console.log(b);

    // Add the book to the web page, let bookDiv = document.createElement("div"); bookDiv:HTMLDivElement to use explicit data type
    let bookDiv:HTMLDivElement = document.createElement("div");

    //    https://www.w3schools.com/JS/js_let.asp
    //    https://www.w3schools.com/JS/js_const.asp
    //    https://www.w3schools.com/jsref/prop_node_textcontent.asp
    //    https://www.w3schools.com/jsref/met_node_appendchild.asp
    //    https://www.w3schools.com/jsref/prop_html_innerhtml.asp
    //    

    let titleHeading = document.createElement("h2");
    titleHeading.textContent = `${b.title} : ${b.isbn}`; // this would also work = b.title + ":" + b.isbn;
    // Add h2 to book div <div><h2>Title : ISBN</h2></div>
    bookDiv.appendChild(titleHeading); 

    let bookDescription:HTMLParagraphElement = document.createElement("p");
    const currencyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD", 
    });
    
    let formattedPrice = currencyFormatter.format(b.price);
    bookDescription.textContent = `This book was released on ${b.releaseDate} and costs ${formattedPrice}`;
    bookDiv.appendChild(bookDescription);

    // Add bookDiv to web page
    // let bookListDisplay = document.querySelector("#book-display")
    // bookListDisplay.appendChild(bookDiv); // Add the newly created book

    document.querySelector("#book-display").appendChild(bookDiv); // This is the same as above but condensed into 1 line of code.

    // document.querySelector("#book-display").innerHTML += `<div><h2>${b.title}:${b.isbn}</h2></div>`; Jo showed this example, but said "don't do this"

}

/**
 * Clears all the validation error message spans in the form
 */
function clearAllErrorMessages() {
    // Get all error spans
    let allSpans = document.querySelectorAll("form span.error-msg");

    // Loop through, and set each span to an empty string
    for(let i = 0; i < allSpans.length; i++) {
        let currentSpan = allSpans[i];
        currentSpan.textContent = "";
    }
}
