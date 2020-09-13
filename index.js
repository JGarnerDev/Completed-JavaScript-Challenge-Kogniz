//  Question One (unit testing in index.test.js, check it out!)

// the 'timeout' variable is kept in global scope (or, since global variables are likely to can context problems,
// preferably one level outside the function)

let timeout;

function delayedCB(d) {
	// rejects non-object arguments first
	if (typeof d !== "object") {
		throw Error(
			`Error, fn delayedCB expecting argument to be an object, instead received  ${typeof d}`
		);
		// ...if passes, will also reject objects without the 'ms' value of 'number'
	} else if (typeof d.ms !== "number") {
		throw Error(
			`Error, fn delayedCB expecting argument property 'ms' to be a number, instead received  ${typeof d.ms}`
		);
		// ...if passes, then rejects objects without the 'cb' value of 'function'
	} else if (typeof d.cb !== "function") {
		throw Error(
			`Error, fn delayedCB expecting argument property 'cb' to be a function, instead received  ${typeof d.cb}`
		);
	}
	// erases previous 'timeout' value held in global scope
	if (timeout) {
		// ends the previously set timeout held in the environment stack
		clearTimeout(timeout);
	}
	// sets new 'timeout' value and initializes a timeout for our d.cb to be executed
	timeout = setTimeout(() => d.cb(), d.ms);
}

// Question Two

// A) My best guess as to what the function 'erif' was intended to be

// 		'erif' is an algorithmic utility function that iterates over the 'cont' array, and if 'cbMatch' returns
// 		true given the first argument of the pointed element of the 'cont' array (cont[i]) and
// 		the numerical index value of the pointer (i), the 'cont' array has the element 'cont[i]'
// 		removed from it, and the array retains the order of its elements while being shortened by 1.
//

//  	To be clear,
// 			if 'cbMatch(cont[2], i)' returns truthy
//  			[ cont[1] , cont[2] , cont[3] ]     == becomes ==>     [ cont[1], cont[3] ]
//
// 			else,
// 				[ cont[1] , cont[2] , cont[3] ]     = no change =>     [ cont[1] , cont[2] , cont[3] ]

// B) Problems with 'erif' if I am correct in my understanding

// 		b1) I am very confident that function 'erif' will remove the element if 'cbMatch' returns truthy,
// 				but it makes no adjustments to the pointer of the loop it is situated in. If, for example,
// 				the first element is removed, the second element (if it exists) will assume index 0, after
// 				which the loop will point to index 1. The element that is now in index 0 evades the algorithm.
//
//				This mistake would occur for every time this condition is repeated.

function erif(cont, cbMatch) {
	for (var i = 0; i < cont.length; ++i) {
		if (cbMatch(cont[i], i)) {
			cont.splice(i, 1);
			// The error is here
			// The remedy is to decrement i, as written below

			// --i
		}
	}
}

// Question Three

// A) My best guess as to the problem that might arise (I would strongly suggest that it is inevitable)
// 		is that variable 'imgCont' is intended to be a node created in the HTML body, whereas in the
//  	function 'doFastPlay', the code as written is attempting to append a child node on the document
//      itself. The resulting thrown error will say something close to "can only append one node to document".

function doFastPlay() {
	// The error is here
	// The remedy is to change "document" to "document.body", as written below

	// var imgCont = document.body.appendChild(document.createElement("div"));
	var imgCont = document.appendChild(document.createElement("div"));

	var img;
	for (;;) {
		var fname = getNextFrameFname(); // returns the filename for the next frame
		if (!fname) break; // end of video stream

		var data = fs.readFileSync(fname);
		// convertJpgDataToImg returns a valid HTML Image object
		var newImg = convertJpgDataToImg(data);

		// We have our valid image element! Show it to the user

		if (img) imgCont.removeChild(img); // remove the old one
		imgCont.appendChild(newImg); // show the new one
		img = newImg;
	}
}

// Question 4

// A) What's wrong here is that the second condition of the 'for' loop ( the condition 'i <= WORDS.length;' ),
// 		it is  implicit that it will always point at an index of the 'WORDS' array that will be one beyond its
// 		end (regardless of it's length). This is because, while the WORDS.length is 5, it only has the indexes
// 		0, 1, 2, 3, and 4. The 5th index does not exist.  Since the second condition allows for the 'i'
// 		variable of the loop to have the value 5 with the less-than-or-equal-to '<=" operator (or lastArrayIndex
//      + 1 for any other length), this try-catch function will always throw it's "Empty word!" error before
// 		it resolves.

var WORDS = ["hello", "my", "name", "is", "laika"];
try {
	// The error is right here, in the second condition of the loop
	// The remedy is to replace 'i <= WORDS.length;' with 'i < WORDS.length;'
	for (var i = 0; i <= WORDS.length; ++i) {
		(function () {
			setTimeout(function () {
				if (!WORDS[i]) throw Error("Empty word!");
				console.log(WORDS[i]);
			}, i * 10);
		})();
	}
} catch (e) {
	console.log("Error: " + e);
}

module.exports = { delayedCB };
