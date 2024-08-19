document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    var mainHeading = document.getElementById('main-heading');
    var mainHeadingText = mainHeading.textContent.trim();
    if (mainHeadingText === 'Sweet Obsession') {
      var firstSubLink = document.querySelector('#sub-link');
      if (firstSubLink) {
        setTimeout(function () {
          filterDishes(firstSubLink.textContent.trim());
        }, 250);
      }
    }
  }, 0);
  setTimeout(function () {
    var priceElements = document.querySelectorAll('.prices-all');

    priceElements.forEach(function (element) {
      console.log("Original text:", element.textContent);
      var updatedText = element.textContent.replace(/\$\s*/g, '$');
      element.textContent = updatedText;
      console.log("Updated text:", element.textContent);
    });
  }, 750);
  var cartItems = document.querySelectorAll('[id="cart-item"]');
  cartItems.forEach(function (cartItem) {
    cartItem.style.display = 'block';
  });

  function sortDishes() {
    var mainList = document.querySelector('#main-list');
    var dishes = Array.from(mainList.querySelectorAll('.w-dyn-item')).filter(function (dish) {
      return dish.style.display !== 'none';
    });

    dishes.sort(function (a, b) {
      var numA = parseInt(a.querySelector('.sorting-number').textContent, 10);
      var numB = parseInt(b.querySelector('.sorting-number').textContent, 10);
      return numA - numB;
    });

    dishes.forEach(function (dish) {
      mainList.appendChild(dish);
    });
  }

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  function formatTextForComparison(text) {
    return text.toLowerCase().replace(/\s+/g, '-');
  }

  function updateSubLinksStyle() {
    const subHeadingText = document.getElementById('sub-heading').textContent.trim();
    const subLinks = document.querySelectorAll('#sub-list .sub-links-text');
    let textForComparison = subHeadingText.split(' (')[0]; // Extract text before any bracket ' ('

    subLinks.forEach((link) => {
      if (link.textContent.trim() === textForComparison) {
        link.style.color = '#eb2b34';
        link.style.fontWeight = 'bold';
      } else {
        link.style.color = ''; // Reset to original color if not default
        link.style.fontWeight = ''; // Reset to original font weight if not default
      }
    });
  }

  const subHeadingObserver = new MutationObserver(updateSubLinksStyle);
  const subHeading = document.getElementById('sub-heading');

  subHeadingObserver.observe(subHeading, {
    characterData: true,
    childList: true,
    subtree: true
  });

  function togglePerPersonDivs(shouldShow) {
    const perPersonDivs = document.querySelectorAll('.div-block-66');
    perPersonDivs.forEach(function (div) {
      div.style.display = shouldShow ? 'flex' : 'none';
    });
  }

  function filterDishes(subCategoryText) {
    var mainHeading = document.getElementById('main-heading');
    const formattedSubCategory = formatTextForComparison(subCategoryText);
    const perPersonDiv = document.querySelectorAll('.div-block-66');
    const subHeading = document.getElementById('sub-heading');

    const restaurantServingSizes = {
      "Jo's Italian Deli": {
        "Sides Platter": 8,
        "Pasta Platter": 4,
        "Sandwich Platter": 4,
        "default": {
          "Trays": 4,
          "Waffles": 21,
          "default": 20
        }
      },
      "Mangia's Sandwiches": {
        "Sides Platter": 10,
        "Regular Sandwich Platter": 5,
        "Large Sandwich Platter": 10
      },
      "Obanhmi": {
        "Sides Box": 20,
        "Banh Mi Box": 20
      },
      "Sweet Obsession": {
        "Pastry Box": 12,
        "Food": 20,
        "Beverages": 12
      }
    };

    if (subCategoryText) {
      let displayText = toTitleCase(subCategoryText);
      const suffixes = ['Platter', 'Tray', 'Trays', 'Platters', 'Cookies', 'Waffles'];

      if (mainHeading && restaurantServingSizes[mainHeading.textContent]) {
        const servingSizes = restaurantServingSizes[mainHeading.textContent];

        if (servingSizes[subCategoryText]) {
          displayText += ` (Serves ${servingSizes[subCategoryText]})`;
          togglePerPersonDivs(true);
        } else if (suffixes.some(suffix => displayText.endsWith(suffix))) {
          const suffixServingSize = servingSizes.default[suffixes.find(suffix => displayText.endsWith(suffix))];
          displayText += ` (Serves ${suffixServingSize || servingSizes.default.default})`;
          togglePerPersonDivs(true);
        } else {
          togglePerPersonDivs(false);
        }
      } else {
        if (suffixes.some(suffix => displayText.endsWith(suffix))) {
          if (displayText.endsWith('Trays')) {
            displayText += ' (Serves 4)';
          } else {
            if (displayText.endsWith('Waffles')) {
              displayText += ' (Serves 21)';
            } else {
              displayText += ' (Serves 20)';
            }
          }
          togglePerPersonDivs(true);
        } else {
          togglePerPersonDivs(false);
        }
      }

      subHeading.textContent = displayText;
    }

    sortDishes();

    const dishes = document.querySelectorAll('#main-list .w-dyn-item');
    dishes.forEach(function (dish) {
      const dishSubCategory = formatTextForComparison(dish.querySelector('.sub-category').textContent.trim());
      if (dishSubCategory.includes(formattedSubCategory)) {
        dish.style.display = 'block';
      } else {
        dish.style.display = 'none';
      }
    });

    updateSubLinksStyle();
  }

  function setInitialDisplay() {
    const firstSubLink = document.querySelector('#sub-link');
    if (firstSubLink) {
      const firstSubLinkText = firstSubLink.textContent.trim();
      filterDishes(firstSubLinkText);
      updateSubLinksStyle();
    } else {
    }
  }

  function closeDropdown() {
    var dropdownToggle = document.querySelector('.w-dropdown-toggle');
    if (dropdownToggle) {
      dropdownToggle.click();
    }
  }
  document.querySelectorAll('#sub-link').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      var linkText = this.textContent.trim();
      filterDishes(linkText);

      closeDropdown();

      var columnSec = document.getElementById('column-sec');
      if (columnSec) {
        columnSec.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }

      if (window.matchMedia("(max-width: 768px)").matches) {
        var mainList = document.getElementById('main-list');
        if (mainList) {
          var firstDiv = mainList.querySelector('div');
          if (firstDiv) {
            firstDiv.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }
    });
  });

  setInitialDisplay();

  var notesInput = document.getElementById('notes-1');
  var checkoutButtons = document.querySelectorAll('[id="checkout-btn-1"]');
  var checkoutButton2 = document.getElementById('checkout-btn-2');
  var popupDiv = document.getElementById('popup-div');

  function saveNotes() {
    if (notesInput) {
      var notes = notesInput.value;
      localStorage.setItem('notes', notes);
    }
  }

  if (checkoutButton2) {
    checkoutButton2.addEventListener('click', function (event) {
      event.preventDefault();
      var dateTimeValue = dateTimeText.textContent;
      var nextPageUrl = "http://example.com/nextpage";

      var newUrl = nextPageUrl + "?datetime=" + encodeURIComponent(dateTimeValue);
      window.location.href = newUrl;
    });
  }

  if (popupDiv) {
    popupDiv.style.display = 'none';

    checkoutButtons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        popupDiv.style.display = 'block';
      });
    });
  }

  var dateTimeText = document.getElementById('date-time-text');
  var dateTimePickerButton = document.getElementById('date-time-picker');

  if (dateTimeText && dateTimePickerButton) {
    var fortyEightHoursFromNow = new Date();
    fortyEightHoursFromNow.setHours(fortyEightHoursFromNow.getHours() + 48);

    if (fortyEightHoursFromNow.getHours() < 11) {
      fortyEightHoursFromNow.setHours(11);
    } else if (fortyEightHoursFromNow.getHours() > 20 || (fortyEightHoursFromNow.getHours() === 20 && fortyEightHoursFromNow.getMinutes() > 0)) {
      fortyEightHoursFromNow.setDate(fortyEightHoursFromNow.getDate() + 1);
      fortyEightHoursFromNow.setHours(11, 0);
    }

    var fpInstance = flatpickr(dateTimeText, {
      disableMobile: true,
      enableTime: true,
      dateFormat: "d M Y | h:i K",
      defaultDate: fortyEightHoursFromNow,
      minDate: fortyEightHoursFromNow,
      minuteIncrement: 1,
      minTime: "11:00",
      maxTime: "20:00",
      onClose: function (selectedDates, dateStr, instance) {
        dateTimeText.textContent = dateStr;
      }
    });
    dateTimeText.textContent = fpInstance.formatDate(fortyEightHoursFromNow, "d M Y | h:i K");
    dateTimePickerButton.addEventListener('click', function () {
      fpInstance.open();
    });
  }

  function handleCheckout() {
    saveNotes();
    var dateTimeText = document.getElementById('date-time-text');
    if (dateTimeText && dateTimeText.value) {
      var dateTimeParts = dateTimeText.value.match(/(\d{2}) (\w{3}) (\d{4}) \| (\d{1,2}):(\d{2}) (AM|PM)/);
      if (dateTimeParts) {
        var day = dateTimeParts[1];
        var month = dateTimeParts[2];
        var year = dateTimeParts[3];
        var hour = parseInt(dateTimeParts[4], 10);
        var minute = dateTimeParts[5];
        var ampm = dateTimeParts[6];

        if (ampm === "PM" && hour < 12) hour += 12;
        if (ampm === "AM" && hour === 12) hour = 0;

        var monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(month);

        var parsedDate = new Date(year, monthIndex, day, hour, minute);

        var isoDateString = parsedDate.toISOString();
        localStorage.setItem('selectedDateTime', isoDateString);
      } else {
      }
    }
    document.querySelectorAll('.additional').forEach(function (button) {
      button.click();
    });
  }
  var checkoutPopButton = document.getElementById('checkout-pop');
  if (checkoutPopButton) {
    checkoutPopButton.addEventListener('click', handleCheckout);
  }

  var crossBtn = document.getElementById('cross-btn');
  if (crossBtn) {
    crossBtn.addEventListener('click', handleCheckout);
  }

  var priceElements = document.querySelectorAll('.prices-all');
  priceElements.forEach(function (element) {
    var updatedText = element.textContent.replace('$ ', '$').replace('$\u00A0', '$');
    element.textContent = updatedText;
  });

  var quantityInputs = document.querySelectorAll('input.quantity-labels');

  quantityInputs.forEach(function (input) {
    input.value = '0';
    if (input.hasAttribute('min')) {
      console.log("HI")
      input.setAttribute('min', '0');
    }
    input.addEventListener('keypress', function (event) {
      if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault();
      }
    });
  });
});

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === 'visible') {
    if (localStorage.getItem('hidePopup') === 'true') {
      var popupDiv = document.getElementById('popup-div');
      if (popupDiv) {
        popupDiv.style.display = 'none';
      }
      localStorage.removeItem('hidePopup');
    }
  }
});
var targetNode = document.getElementById('price-sub');
// Select all elements that match the given ID. Since IDs should be unique but you have duplicates, this approach targets them as a workaround.
var buttons = document.querySelectorAll('[id="checkout-btn-1"]');

function updateButtonStyles(button, disabled) {
  if (disabled) {
    button.style.backgroundColor = 'rgba(235, 43, 52, 0.5)';
    button.style.cursor = 'not-allowed';
    button.style.pointerEvents = 'none';
  } else {
    button.style.backgroundColor = '';
    button.style.cursor = '';
    button.style.pointerEvents = '';
  }
}

var observer = new MutationObserver(function (mutationsList, observer) {
  for (var mutation of mutationsList) {
    if (mutation.type === 'childList' || mutation.type === 'characterData') {
      var priceValue = parseFloat(mutation.target.textContent.replace(/\$\s*/, ''));

      // Determine the disabled state based on priceValue
      var disabled = !isNaN(priceValue) && priceValue < 300;

      // Apply the updated styles to each button with the given ID
      buttons.forEach(function (button) {
        button.disabled = disabled;
        updateButtonStyles(button, disabled);
      });
    }
  }
});

var mainHeading = document.getElementById('main-heading');
var topHeading = document.getElementById('top-heading');
var topDescription = document.getElementById('top-description');
var topHeading2 = document.getElementById('top-heading-2');

function updateContent(mainHeadingText, headingText, descriptionText) {
  if (topHeading) {
    topHeading.textContent = headingText;
  }
  if (topDescription) {
    topDescription.textContent = descriptionText;
  }
  if (mainHeading) {
    var parentElement = mainHeading.parentNode;
    if (parentElement) {
      parentElement.insertBefore(topHeading, mainHeading);
    }
  }
}

function toggleDisplay(condition) {
  if (topHeading) {
    topHeading.style.display = condition ? 'none' : 'block';
  }
  if (topHeading2) {
    topHeading2.style.display = condition ? 'block' : 'none';
  }
}

if (mainHeading) {
  var mainHeadingText = mainHeading.textContent.trim();
  if (mainHeadingText === 'Handi Grill') {
    updateContent('Handi Grill', 'Catering', 'Delight in rich Indian flavors with our catering, offering traditional dishes like curries, biryanis, and naan, perfect for any event');
    toggleDisplay(true);
  } else if (mainHeadingText === 'Saucin Staples') {
    updateContent('Saucin Staples', 'Catering', 'Experience the perfect blend of traditional Indian flavors and contemporary culinary innovation with our catering');
    toggleDisplay(true);
  } else if (mainHeadingText === 'Pokey Okey') {
    updateContent('Pokey Okey', 'Catering', 'Experience authentic Hawaiian poke bowls with fresh, vibrant flavors through our catering services, perfect for any event');
    toggleDisplay(true);
  } else if (mainHeadingText === 'Obanhmi') {
    updateContent('Obanhmi', 'Catering', 'Offering authentic Vietnamese banh mi sandwiches for catering, featuring fresh ingredients and bold flavors');
    toggleDisplay(true);
  } else if (mainHeadingText === 'Jo\'s Italian Deli') {
    updateContent('Jo\'s Italian Deli', 'Catering', 'Experience authentic Italian cuisine with our catering service offering delectable pastas and artisanal sandwiches');
    toggleDisplay(true);
  } else if (mainHeadingText === 'Mangia\'s Sandwiches') {
    updateContent('Mangia\'s Sandwiches', 'Catering', 'Savor the taste of Italy with our catering service featuring a variety of artisanal sandwiches');
    toggleDisplay(true);
  } else if (mainHeadingText === 'La Mezcaleria') {
    updateContent('La Mezcaleria', 'Catering', 'Delight in authentic Mexican flavors with our catering service, offering a selection of handcrafted tacos and traditional dishes');
    toggleDisplay(true);
  } else if (mainHeadingText === 'Sweet Obsession') {
    updateContent('Sweet Obsession', 'Catering', 'Offering delicious and diverse catering with beverages, pastries, and cakes to elevate every occasion.');
    toggleDisplay(true);
  } else {
    toggleDisplay(false);
  }
}

var itemsRestaurant1 = [
  "Small Platter",
  "Medium Platter",
  "Large Platter",
  "Very Large Platter",
  "Jumbo Large Platter",
  "Very Jumbo Large Platter",
  "Super Large Platter"
];

var itemsRestaurant2 = [
  "Single Serve",
  "Family Pack",
  "Party Pack",
  "Feast Pack",
  "Mega Feast Pack"
];

var itemsRestaurant3 = [
  "Individual Meal",
  "Couples Meal",
  "Family Meal",
  "Office Party Pack",
  "Corporate Pack"
];

var headingText = document.getElementById("main-heading").innerText;
var clubDiv = document.getElementById("club-div");

if (headingText.trim() === "Club Kitchen") {
  if (clubDiv) {
    clubDiv.style.display = "flex";
  } else {
    console.error("clubDiv element not found.");
  }

  function loadItemsForRestaurant(items) {
    var existingLinks = clubDiv.querySelectorAll("#main-sub-link");
    existingLinks.forEach(function (link) {
      link.remove();
    });

    items.forEach(function (item) {
      createLinkBlock(item);
    });
  }

  function createLinkBlock(text) {
    var mainSubLink = document.createElement("div");
    mainSubLink.id = "main-sub-link";
    mainSubLink.className = "link-div adjusted";

    var linkBlock = document.createElement("a");
    linkBlock.id = "sub-link-club";
    linkBlock.className = "sub-link-club w-inline-block";
    linkBlock.href = "#";

    var textDiv = document.createElement("div");
    textDiv.id = "sub-links-club-text";
    textDiv.className = "sub-links-club";
    textDiv.innerText = text;

    linkBlock.appendChild(textDiv);
    mainSubLink.appendChild(linkBlock);
    clubDiv.appendChild(mainSubLink);

    // Add the filtering functionality
    linkBlock.addEventListener('click', function (event) {
      event.preventDefault();
      filterProductsByCategory(text);
    });
  }

  function filterProductsByCategory(subCategory) {
    var products = document.querySelectorAll('#main-list .w-dyn-item');
    const subHeadingText = document.getElementById('sub-heading').textContent.trim();
    const mainCategory = subHeadingText.trim().replace(" ", "-");

    products.forEach(function (product) {
      var productSubCategory = product.querySelector('.sub-category').textContent.trim();
      console.log("Whole SKU is: ", productSubCategory);
      console.log("Main Category is: ", mainCategory);
      console.log("Sub Category is: ", subCategory);
      if (productSubCategory.includes(mainCategory) && productSubCategory.includes(subCategory)) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    });

    //sortDishes(); // Call existing sort function if necessary
  }

  // Event listeners for each link inside the sub-list
  document.querySelectorAll('#sub-list .sub-links-text').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      var linkText = link.textContent.trim();

      // Load the correct items based on the link text
      if (linkText === 'Restaurant 1') {
        loadItemsForRestaurant(itemsRestaurant1);
      } else if (linkText === 'Restaurant 2') {
        loadItemsForRestaurant(itemsRestaurant2);
      } else if (linkText === 'Restaurant 3') {
        loadItemsForRestaurant(itemsRestaurant3);
      } else {
        console.error("No items found for the selected restaurant.");
      }
    });
  });

  // Load items for "Restaurant 1" by default when the page loads
  loadItemsForRestaurant(itemsRestaurant1);

} else {
  console.error("Main heading does not match 'Club Kitchen'.");
  clubDiv.style.display = "none";
}

var config = { childList: true, subtree: true, characterData: true };
observer.observe(targetNode, config);
