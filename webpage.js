/* 
PORTFOLIO - webpage.js
Author : Olamide Akinola
Features:
- Smooth scrolling navbar with active link highlight
- Hamburger menu toggle for mobile
- Navbar background change on scroll
- Fade-in animations for sections using IntersectionObserver
- Dynamic greeting based on time of day
- Dark / Light theme toggle + localStorage
- Scroll-to-top button
- Button ripple click effect
- Contact form validation
- Live character counter
- Skill card click interaction
- Project tech tag hover effect
- localStorage personalised return greeting
*/

/* -- 1. NAVBAR: change background on scroll -- */
var navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {
  if (window.scrollY > 40) {
    navbar.style.background = "rgba(10,10,20,0.95)";
    navbar.style.borderBottomColor = "rgba(255,255,255,0.1)";
  } else {
    navbar.style.background = "rgba(10,10,20,0.7)";
    navbar.style.borderBottomColor = "rgba(255,255,255,0.08)";
  }
});

/* -- 2. HAMBURGER MENU toggle (mobile) -- */
var navToggle = document.getElementById("navToggle");
var navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", function () {
  navLinks.classList.toggle("open");
});

/* Close menu when a nav link is clicked */
var links = navLinks.querySelectorAll("a");
for (var i = 0; i < links.length; i++) {
  links[i].addEventListener("click", function () {
    navLinks.classList.remove("open");
  });
}

/* -- 3. ACTIVE NAV LINK on scroll -- */
var sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", function () {
  var scrollY = window.scrollY + 100;

  sections.forEach(function (section) {
    var top = section.offsetTop;
    var height = section.offsetHeight;
    var id = section.getAttribute("id");
    var link = document.querySelector('.nav-links a[href="#' + id + '"]');

    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.style.color = "#89b4fa";
        link.style.fontWeight = "600";
      } else {
        link.style.color = "";
        link.style.fontWeight = "";
      }
    }
  });
});

/* -- 4. FADE-IN on scroll using IntersectionObserver -- */
var fadeElements = document.querySelectorAll(".fade-in");

var observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        /* Small stagger delay based on element position in its parent */
        var siblings = entry.target.parentElement
          ? entry.target.parentElement.querySelectorAll(".fade-in")
          : [];
        var index = Array.prototype.indexOf.call(siblings, entry.target);
        var delay = Math.min(index * 80, 400); /* cap at 400ms */

        setTimeout(
          function (el) {
            el.classList.add("visible");
          },
          delay,
          entry.target
        );

        /* Stop observing once visible */
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  }
);

fadeElements.forEach(function (el) {
  observer.observe(el);
});

/* -- 5. SMOOTH SCROLL for browsers that don't support CSS scroll-behavior -- */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    var target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

/*
NEW FEATURE 1 - DYNAMIC GREETING BASED ON TIME OF DAY

What it does:
Reads the current hour and writes "Good morning / afternoon / evening" into the <p id="greeting"> element in the hero section.

Concepts introduced:
🔯 new Date() - an object holding the current date & time
🔯 .getHours() - pulls out just the hour number (0-23)
🔯 if / else if / else - makes a choice based on a condition
🔯 document.getElementById - finds an HTML element by its id="" value
🔯 element.innerHTML - changes the visible content inside an element (used instead of textContent because we are inserting HTML tags for Font Awesome icons)
*/

// document.getElementById("greeting") searches the whole page for the
// element that has id="greeting" and gives us access to it in JS.
//We store that reference in a variable called greetingEl.
var greetingEl = document.getElementById("greeting");

// "if (greetingEl)" means: only run the code inside {} if the element
// was actually found. This prevents crashes if element is missing.
if (greetingEl) {
  // newDate() creates a Date object with the current date and time.
  // .getHours() reads just the hour as a number (0 = midnight, 23 = 11pm).
  var currentHour = new Date().getHours();

  // We declare an empty variable to hold whichever greeting we pick.
  var greetingText;

  // if / else if checks multiple conditions in order.
  // JavaScript stops at the FIRST one that is true.
  if (currentHour >= 5 && currentHour < 12) {
    // && means AND - both sides must be true.
    // This runs for hours 5, 6, 7, 8, 9, 10, 11.
    // <i class="fa-solid fa-sun"></i> is a Font Awesome sun icon tag.
    greetingText =
      '<i class="fa-solid fa-sun"></i> Good morning! Welcome to my portfolio.';
  } else if (currentHour >= 12 && currentHour < 17) {
    // Hours 12, 13, 14, 15, 16 ➡️ afternoon
    greetingText =
      '<i class="fa-solid fa-cloud-sun"></i> Good afternoon! Welcome to my portfolio.';
  } else if (currentHour >= 17 && currentHour < 21) {
    // Hours 17, 18, 19, 20 ➡️ evening
    greetingText =
      '<i class="fa-solid fa-city"></i> Good evening! Welcome to my portfolio.';
  } else {
    // All other hours (0-4 and 21-23) ➡️ late nights
    greetingText =
      '<i class="fa-solid fa-moon"></i> Browsing late? Welcome to my portfolio!';
  }

  // Put the chosen greeting into the HTML element using innerHTML.
  // We use innerHTML (not textContent) because greetingText now contains
  // an <i> tag for the Font Awesome icon. textContent would print the
  // raw tag as plain text instead of rendering it as an icon.
  greetingEl.innerHTML = greetingText;
}

/*
NEW FEATURE 2 - DARK / LIGHT THEME TOGGLE (+ localStorage so the choice is remembered on next visit)

What it does:
Clicking the moon/sun button in the navbar switches between dark and light colour schemes. The choice is saved so it persists when the user refreshes or comes back later.

How the CSS side works:
All colours in webpage.css are defined as CSS variables (--bg, --text, etc.).
When JS adds data-theme="light" to the <html> tag, a CSS rule [data-theme="light"] overrides those variables with light colours.
Removing the attributes lets the default dark colours return.

Concepts introduced:
🔯 document.documentElement - the <html> element at the very tp of the page
🔯 setAttribute / removeAttribute - adds or removes an HTML attribute 
🔯 getAttribute - reads the current value of an attribute
🔯 localStorage.setItem - saves a value in the browser (permanently)
🔯 localStorage.getItem - reads a previously saved value
🔯 element.innerHTML - sets HTML content (used for Font Awesome icons)
*/

// Find the theme toggle button in the navbar by its id
var themeBtn = document.getElementById("themeToggle");

// localStorage is like a small notepad that every browser has.
// .getItem("theme") reads the value saved under the label "theme".
// If the user has never visited before, this returns null (nothing).
var savedTheme = localStorage.getItem("theme");

// Apply the saved theme immediately when the page loads,
// before the browser paints anything, to avoid a colour "flash".
if (savedTheme === "light") {
  // document.documentElement is the <html> element - the root of the page.
  // setAttribute("data-theme", "light") literally adds data-them ="light"
  // as an attribute on the <html> tag, which the CSS uses to swap colours.

  document.documentElement.setAttribute("data-theme", "light");

  // Update the button icon to a sun because we are in light mode.
  // We use InnerHTML (not textContent) so the <i> tag renders as an icon.
  if (themeBtn) {
    themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
}

// Set up the click handler only if the button was found on the page
if (themeBtn) {
  themeBtn.addEventListener("click", function () {
    // getAttribute reads the current value of data-theme on <html>
    var currentTheme = document.documentElement.getAttribute("data-theme");

    if (currentTheme === "light") {
      // Currently LIGHT ➡️ switch to DARK
      // removeAttribute deletes the entire data-theme attribute.
      // Without it, the page falls back to the default dark CSS variables.

      document.documentElement.removeAttribute("data-theme");

      // Change the icon back to a moon using innerHTML
      themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';

      // Save "dark" so the next page load remembers this choice
      localStorage.setItem("theme", "dark");
    } else {
      // Currently DARK ➡️ switch to LIGHT

      document.documentElement.setAttribute("data-theme", "light");

      // Change the icon to a sun using innerHTML
      themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';

      // Save "light"
      localStorage.setItem("theme", "light");
    }
  });
}

/*
NEW FEATURE 3 - SCROLL-TO-TOP BUTTON

What it does:
After the user scrolls down 300px, a button appears in the bottom-right corner. Clicking it scrolls back to the top.

Concepts introduced:
🔯 window.scrollY - how many pixels the page has scrolled down
🔯 classList.add/remove - adds or removes a CSS class on an element
🔯 window.scrollTo() - moves the page scroll position
*/

// Find the scroll-to-top button by its id
var scrollTopBtn = document.getElementById("scrollTopBtn");

// JavaScript lets you add MULTIPLE listeners to the same event.
// The original scroll listener above handles the navbar.
// Ths new one runs at the same time - they don't interfere.
window.addEventListener("scroll", function () {
  // Guard: only run this code if the button exists
  if (!scrollTopBtn) {
    return;
  }

  // window.scrollY is the number of pixels the page has scrolled from the top.
  if (window.scrollY > 300) {
    // The CSS for .scroll-top-btn starts invisible (opacity:0).
    // Adding the class "visible" triggers the CSS transition to fade it in.
    scrollTopBtn.classList.add("visible");
  } else {
    // Close to the top - hide the button again

    scrollTopBtn.classList.remove("visible");
  }
});

// When the button is clicked, scroll smoothly to the very top
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", function () {
    // window.scrollTo() sets the page's scroll position.
    // top: 0 means go to 0 pixels from the top (the very beginning).
    // behavior: "smooth" makes it animate instead of jump instantly.
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/*
NEW FEATURE 4 - BUTTON RIPPLE CLICK EFFECT (DOM Manipulation)

What it does:
When any button is clicked, a white circle expands outward from the exact click point and fades out - a classic effect.

This is a strong DOM manipulation example:
JavaScript creates a brand-new HTML element, positions it, inserts it into the page, then deletes it after 600ms.

Concepts introduced:
🔯 event.clientX / clientY - pixel coordinates where the click happened
🔯 getBoundingClientRect() - gets an element's exact position on screen
🔯 document.createElement() - creates a new element in JavaScript memory
🔯 element.appendChild() - inserts an element inside another element
🔯 element.style.property - sets a CSS property directly from JavaScript
🔯 setTimeout(fn, ms) - runs a function after a delay in milliseconds
🔯 element.remove() - deletes an element from the page
*/

// We define a reusable function.
// A function is a named block of code you can call whenever you need it.
function addRippleEffect(button) {
  // Listen for clicks on this specific button.
  // The "e" parameter is the event object - it carries click details.
  button.addEventListener("click", function (e) {
    // Step 1 - Creates a brand new <span> element in JavaScript memory.
    // It doesn't appear on the page yet - we just create it first.
    var ripple = document.createElement("span");

    // Step 2 - Give it the CSS class "ripple".
    // This class in webpage.css makes it a circle with a grow+fade animation.
    ripple.classList.add("ripple");

    // Step 3 - Find the button's current position on the screen.
    // getBoundingClientRect() returns an object with; top, left, width, height.
    // These are measured from the top-left corner of the browser window.
    var rect = button.getBoundingClientRect();

    // Step 4 - Calculate WHERE inside the button the user clicked.
    // e.clientX = the click's X coordinate from the left edge of the window.
    // rect.left = the button's left edge from the left edge of the window.
    // Subtracting them gives the X position RELATIVE TO the button itself.
    var clickX = e.clientX - rect.left;
    var clickY = e.clientY - rect.top;

    // Step 5 - Position the ripple centred on the click point.
    // The ripple element is 20px wide and tall. We subtract 10 (half of 20)
    // so the centre of the circle aligns with where the user clicked.
    ripple.style.left = clickX - 10 + "px";
    ripple.style.top = clickY - 10 + "px";

    // Step 6 -  Insert the ripple INSIDE the button so it appears on top.
    // appendChild adds the new element as the last child inside the button.
    button.appendChild(ripple);

    // Step 7 - Delete the ripple  after 600ms so they don't accumulate.
    // setTimeout waits 600 milliseconds, then runs the function inside.
    setTimeout(function () {
      ripple.remove();
      // .remove() deletes the element from the page
    }, 600);
  });
}

// Apply the ripple to every .btn, .contact-btn, and .mini-form-btn element.
// querySelectorAll returns a list of ALL matching elements.
var allButtons = document.querySelectorAll(
  ".btn, .contact-btn, .mini-form-btn"
);

// forEach loops through each item in that list and runs a function on it.
allButtons.forEach(function (btn) {
  addRippleEffect(btn);
});

/*
NEW FEATURE 5 - CONTACT FORM VALIDATION

What it does:
When the user clicks "Send Message", JavaScript checks every field before accepting it. Wrong or empty fields get a red error message. All correct ➡️ green success message appears.

Concepts introduced :
🔯 "submit" event - fires when a form's submit button is clicked
🔯 e.preventDefault() - stops the browser from refreshing the page 
🔯 element.value.trim() - reads text from a field and removes edge spaces
🔯 string.length - counts characters in a string
🔯 string.includes("@") - checks if a string contains a specific character 
🔯 element.hidden - hides (true) or shows (false) an element 
🔯 form.reset() - clears all form fields back to empty
*/

// Find the form by its id
var contactForm = document.getElementById("contactForm");

if (contactForm) {
  // "submit" fires when the user clicks the submit button inside the form
  contactForm.addEventListener("submit", function (e) {
    // e.preventDefault() stops the browser's default behaviour.
    // Normally, submitting a form refreshes the page and loses all input.
    // We call this so WE decide what happens instead.
    e.preventDefault();

    //Read each field's value.
    // .value is the text the user typed, as a string.
    // .trim() removes any extra spaces at the start or end.
    // Example: " Olamide " becomes "Olamide" after trim().
    var name = document.getElementById("formName").value.trim();
    var email = document.getElementById("formEmail").value.trim();
    var message = document.getElementById("formMsg").value.trim();

    // This flag tracks whether ANY error was found.
    // We start assuming no errors (false = no error found yet).
    var hasError = false;

    // - Check Name
    var nameError = document.getElementById("nameError");
    if (name === "") {
      // name === "" means the string is completely empty
      nameError.textContent = " Please enter your name.";
      hasError = true;
      //mark that an error was found
    } else if (name.length < 2) {
      // .length counts the number of characters in the string
      nameError.textContent = "Name must be at least 2 characters.";
      hasError = true;
    } else {
      // Name looks good - clear any previous error message
      nameError.textContent = "";
    }

    // - Check Email
    var emailError = document.getElementById("emailError");
    if (email === "") {
      emailError.textContent = "Please enter your email address.";
      hasError = true;
    } else if (!email.includes("@") || !email.includes(".")) {
      // .includes("@") returns true if "@" is found inside the string.
      // The ! in front flips the result: !email.includes("@") = true when "@" is MISSING.
      // || means OR - catches emails missing "@" OR missing "."
      emailError.textContent =
        "Please enter a valid email (e.g. you@gmail.com).";
      hasError = true;
    } else {
      emailError.textContent = "";
    }

    // - Check Message
    var msgError = document.getElementById("msgError");
    if (message === "") {
      msgError.textContent = "Please write a message.";
      hasError = true;
    } else if (message.length < 10) {
      msgError.textContent =
        "Message too short - please write at least 10 characters.";
      hasError = true;
    } else {
      msgError.textContent = "";
    }

    // - Accept if no errors
    if (!hasError) {
      // !hasError means "if hasError is false" = if there are NO errors

      // Show the success paragraph (hidden="true" becomes hidden="false")
      var successMsg = document.getElementById("formSuccess");
      successMsg.hidden = false;

      // Save the visitor's name to localStorage (used by Feature 9)
      if (name.length > 1) {
        localStorage.setItem("visitorName", name);

        // Clear all form fields back to empty
        contactForm.rest();

        // Reset the character counter display
        var charCountEl = document.getElementById("charCount");
        if (charCountEl) {
          charCountEl.textContent = "0 / 200";
        }

        // Hide the success message again after 5 seconds (5000 milliseconds)
        setTimeout(function () {
          successMsg.hidden = true;
        }, 5000);
      }
    }
  });
}

/*
NEW FEATURE 6 - LIVE CHARACTER COUNTER (DOM Manipulation)

What it does:
As you type in the message textarea, a small counter next to the label updates in real time: "47 / 200". It turns red when within 20 characters of the 200-character limit.

This is a clear DOM manipulation example: JavaScript reads a user input value and immediately updates another element on the page.

Concepts introduced:
🔯 "input" event - fires every time the user types, deletes, or pastes
🔯 .value.length - number of characters currently in the field
🔯 string concatenation + - joins text and numbers together
*/

// Find the textarea and the character count display element
var msgTextarea = document.getElementById("formMsg");
var charCountEl = document.getElementById("charCount");
var MAX_CHARS = 200;
// matches maxlength="200" in the HTML textarea

if (msgTextarea && charCountEl) {
  // The "input" event fires immediately every time the content changes -
  // typing, deleting, copy-pasting - all of it.
  msgTextarea.addEventListener("input", function () {
    // .value is the full text string inside the textarea.
    // .length counts how many characters that text has.
    var usedChars = msgTextarea.value.length;

    // Update the counter text by joining strings with the + operator.
    charCountEl.textContent = usedChars + " / " + MAX_CHARS;

    // When within 20 characters of the limit, add a red-colour CSS class.
    if (usedChars >= MAX_CHARS - 20) {
      charCountEl.classList.add("char-danger");
    } else {
      charCountEl.classList.remove("char-danger");
    }
  });
}

/*
NEW FEATURE 7 -  SKILL CARD CLICK INTERACTION (DOM + Events)

What it does:
Clicking a skill card gives it a glowing blue highlight border.
Clicking it again (or clicking a different card) removes it.
Only ONE card can be highlighted at a time.

Concepts introduced:
🔯 querySelectorAll - selects ALL elements matching a CSS selector, returning a NodeList (list of elements)
🔯 forEach - runs a function once for each item in a list 
🔯 classList.contains - returns true if an element has that class
🔯 classList.add / remove - adds or removes a CSS class
*/

// querySelectorAll gets ALL elements with class "skill-card" as a list.
var skillCards = document.querySelectorAll(".skill-card");

// Loop through every skill card and attach a click listener to each one.
skillCards.forEach(function (card) {
  card.addEventListener("click", function () {
    // Check if THIS specific card already has the "skill-selected" class.
    // classList.contains returns true or false.
    var alreadySelected = card.classList.contains("skill-selected");

    // First, remove the highlight from ALL cards.
    // We use a second forEach loop inside the first one.
    skillCards.forEach(function (otherCard) {
      otherCard.classList.remove("skill-selected");
    });

    // if this card was NOT already selected, select it now.
    // (If it WAS selected, we already removed the class above - so
    // clicking it again acts as a deselect, which is correct.)
    if (!alreadySelected) {
      card.classList.add("skill-selected");
    }
  });
});

/* 
NEW FEATURE 8 - EVENT LISTENERS: TECH TAG HOVER EFFECT

What it does:
When the mouse hovers over a technology tag on a project card (e.g. "Python"), it adds a wrench icon. When the mouse leaves, it restores the original text.

This demonstrates mouseenter and mouseleave - two very commonly used events in web development.

Concepts introduced:
🔯 "mouseenter" - fires once when the mouse ENTERS the element
🔯 "mouseleave" - fires once when the mouse LEAVES the element
🔯 setAttribute - stores extra data on an element
🔯 getAttribute - reads that stored data back later
🔯 element.textContent - reads the visible plain text of an element
🔯 element.innerHTML - sets HTML content including icon tags
*/

// Select all technology tags inside project cards.
// ".project-tech span" matches every <span> inside a .project-tech div.
var techTags = document.querySelectorAll(".project-tech span");

techTags.forEach(function (tag) {
  // "mouseenter" fires when the cursor moves INTO this element
  tag.addEventListener("mouseenter", function () {
    // Save the original plain text before we change anything.
    // We use textContent here (not innerHTML) because at this moment
    // the tag contains only plain text like "Python" - no icon tags yet.
    // getAttribute will let us read this saved text back later.
    tag.setAttribute("data-original", tag.textContent);

    // Replace the tag content with a Font Awesome wrench icon + the original text.
    // We use innerHTML so the <i> tag renders as an actual icon, not raw text.
    tag.innerHTML =
      '<i class="fa-solid fa-wrench"></i> ' + tag.getAttribute("data-original");
  });

  // "mouseleave" fires when the cursor moves OUT of this element
  tag.addEventListener("mouseleave", function () {
    // Read back the original plain text we saved on mouseenter
    var original = tag.getAttribute("data-original");

    // Restore it as plain text (safety check: only if we actually saved something).
    // Using textContent here clears the icon and sets the tag back to plain text.
    if (original) {
      tag.textContent = original;
    }
  });
});

/*
NEW FEATURE 9 - LOCALSTORAGE: PERSONALISED RETURN GREETING

What it does:
When the contact form is submitted successfully, the visitor's name is saved to localStorage (this happens inside Feature 5).
On the NEXT visit, this code reads that saved name and changes the greeting from generic to personal: "[sun icon] Good morning, Olamide! Welcome back."

localStorage is like a mini-database inside every browser.
It keeps data even after the browser is closed - until the user manually clears their browser storage.

localStorage.setItem("key", value) - saves a value
localStorage.getItem("key") - reads it back
If the key was never saved, getItem returns null.

NOTE: The saving happens inside Feature 5's form submit handler.
This section only READS and applies the saved name.
*/

// Try to read a name saved by a previous visit.
// savedName will a null if this is the first visit.
var savedName = localStorage.getItem("visitorName");

// Only personalise the greeting if we have both a saved name
// AND the greeting element exists in the HTML.
if (savedName && greetingEl) {
  // Get the current hour again (same logic as Feature 1)
  var hourNow = new Date().getHours();
  var personalGreeting;

  // Build the greeting prefix using a Font Awesome con tag.
  // The full string will later be joined with the visitor's name.
  if (hourNow >= 5 && hourNow < 12) {
    personalGreeting = '<i class="fa-solid fa-sun"></i> Good morning';
  } else if (hourNow >= 12 && hourNow < 17) {
    personalGreeting = '<i class="fa-solid fa-cloud-sun"></i> Good afternoon';
  } else if (hourNow >= 17 && hourNow < 21) {
    personalGreeting = '<i class="fa-solid fa-city"></i> Good evening';
  } else {
    personalGreeting = '<i class="fa-solid fa-moon"></i> Hey';
  }

  // Overwrite the generic greeting with the personalised version.
  // We use innerHTML (not textContent) because personalGreeting contains
  // an <i> icon tag that must be rendered as HTML, not printed as plain text.
  // The + operator joins the strings together.
  // If savedName is "Olamide", this becomes:
  // '<i class="fa-solid fa-sun"></i> Good morning, Olamide! Welcome back.'
  greetingEl.innerHTML =
    personalGreeting + ", " + savedName + "! Welcome back.";
}
