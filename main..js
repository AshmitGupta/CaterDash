document.addEventListener("DOMContentLoaded", function () {
  // Initialize various elements
  var mainHeading = document.getElementById('main-heading');
  var subHeading = document.getElementById('sub-heading');
  var clubDiv = document.getElementById("club-div");
  var popupDiv = document.getElementById('popup-div');
  var priceElements = document.querySelectorAll('.prices-all');
  var checkoutButton2 = document.getElementById('checkout-btn-2');
  var dateTimeText = document.getElementById('date-time-text');
  var dateTimePickerButton = document.getElementById('date-time-picker');
  
  const suffixes = ['Platter', 'Tray', 'Trays', 'Platters', 'Cookies', 'Waffles'];
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
    },
    "Holiday Menu": {
      "Breakfast": 20,
      "Plated": 20,
      "Canapés (Cold)": 3,
      "Canapés (Hot)": 3,
      "Canapés (Sweet)": 3,
      "Reception Stations": 20,
      "Buffet": 20,
      "Chef Attended Reception Station": 20
    },
    "Baked Goods & Coffee": {
      "Baked Goods Platter": 12,
      "Drinks": 12
    }
  };

  // Mutation observer to monitor changes and trigger relevant updates
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      const mutationTarget = mutation.target;
      const targetText = mutationTarget.textContent.trim();

      if (mutation.type === 'characterData' || mutation.type === 'childList') {
        if (mutationTarget === subHeading) {
          updateMinValues();
          updateSubLinksStyle();
          updateMarginBasedOnCategory();
        } else if (mutationTarget === mainHeading) {
          filterDishes(targetText);
        }
      }

      if (mutation.type === 'childList' && priceElements.length) {
        updatePrices();
      }
    });
  });

  const config = { childList: true, subtree: true, characterData: true };
  observer.observe(document.body, config);

  // Filter dishes based on subcategory text
  function filterDishes(subCategoryText) {
    var formattedSubCategory = formatTextForComparison(subCategoryText);
    const dishes = document.querySelectorAll('#main-list .w-dyn-item');
    
    dishes.forEach(function (dish) {
      const dishSubCategory = formatTextForComparison(dish.querySelector('.sub-category').textContent.trim());
      if (dishSubCategory.includes(formattedSubCategory)) {
        dish.style.display = 'block';
      } else {
        dish.style.display = 'none';
      }
    });
    sortDishes();
    updateSubLinksStyle();
  }

  // Update sub-links style based on sub-heading match
  function updateSubLinksStyle() {
    const subHeadingText = subHeading.textContent.trim();
    const subLinks = document.querySelectorAll('#sub-list .sub-links-text');
    subLinks.forEach((link) => {
      if (link.textContent.trim() === subHeadingText) {
        link.style.color = '#eb2b34';
        link.style.fontWeight = 'bold';
      } else {
        link.style.color = '';
        link.style.fontWeight = '';
      }
    });
  }

  // Update minimum values for quantity inputs based on category
  function updateMinValues() {
    const quantityInputs = document.querySelectorAll('[name="commerce-add-to-cart-quantity-input"]');
    const category = subHeading.textContent.trim();

    quantityInputs.forEach(function (input) {
      let minValue = '';

      if (category.includes("Breakfast") || category.includes("Plated") || category.includes("Buffet")) {
        minValue = '20';
      } else if (category.includes("Canapés (Cold) (Per Dozen)") || category.includes("Canapés (Hot) (Per Dozen)") || category.includes("Canapés (Sweet) (Per Dozen)")) {
        minValue = '3';
      } else if (category.includes("Reception Stations") && !category.includes("Chef Attended")) {
        minValue = '20';
      } else if (category.includes("Sushi")) {
        minValue = '1';
      } else if (category.includes("Chef Attended Reception Station")) {
        minValue = '20';
      }

      if (minValue) {
        input.setAttribute('min', minValue);
        input.value = minValue;
      }
    });
  }

  // Format price elements by removing extra spaces
  function updatePrices() {
    priceElements.forEach(function (element) {
      var updatedText = element.textContent.replace(/\$\s*/g, '$');
      element.textContent = updatedText;
    });
  }

  // Update margins for elements based on specific categories
  function updateMarginBasedOnCategory() {
    const category = subHeading.textContent.trim();
    const richTextBlocks = document.querySelectorAll('.rich-text-block');

    richTextBlocks.forEach(function (element) {
      if (category.includes("Sushi") || category.includes("Reception Stations")) {
        element.style.marginTop = '20px';
      } else {
        element.style.marginTop = '';
      }
    });
  }

  // Sorting function for dishes
  function sortDishes() {
    var mainList = document.querySelector('#main-list');
    var dishes = Array.from(mainList.querySelectorAll('.w-dyn-item')).filter(dish => dish.style.display !== 'none');

    dishes.sort(function (a, b) {
      var numA = parseInt(a.querySelector('.sorting-number').textContent, 10);
      var numB = parseInt(b.querySelector('.sorting-number').textContent, 10);
      return numA - numB;
    });

    dishes.forEach(function (dish) {
      mainList.appendChild(dish);
    });
  }

  // Format text for comparison
  function formatTextForComparison(text) {
    return text.toLowerCase().replace(/\s+/g, '-');
  }

  // DateTime Picker setup with Flatpickr
  if (dateTimeText && dateTimePickerButton) {
    var fortyEightHoursFromNow = new Date();
    fortyEightHoursFromNow.setHours(fortyEightHoursFromNow.getHours() + 48);
    if (fortyEightHoursFromNow.getHours() < 11) { fortyEightHoursFromNow.setHours(11); } 
    else if (fortyEightHoursFromNow.getHours() > 20) {
      fortyEightHoursFromNow.setDate(fortyEightHoursFromNow.getDate() + 1);
      fortyEightHoursFromNow.setHours(11, 0);
    }
    var fpInstance = flatpickr(dateTimeText, {
      disableMobile: true, enableTime: true, dateFormat: "d M Y | h:i K",
      defaultDate: fortyEightHoursFromNow, minDate: fortyEightHoursFromNow,
      minuteIncrement: 1, minTime: "11:00", maxTime: "20:00",
      onClose: function (selectedDates, dateStr) {
        dateTimeText.textContent = dateStr;
      }
    });
    dateTimeText.textContent = fpInstance.formatDate(fortyEightHoursFromNow, "d M Y | h:i K");
    dateTimePickerButton.addEventListener('click', function () { fpInstance.open(); });
  }

  // Price Formatting and Cart Inputs
  document.querySelectorAll('.cart-quantity-2').forEach(input => { input.disabled = true; });
  document.querySelectorAll('input.quantity-labels').forEach(input => {
    input.value = '0';
    input.setAttribute('min', '0');
    input.addEventListener('keypress', event => { if (event.key === 'Enter') event.preventDefault(); });
  });
});
