// spinner
const spinner = document.getElementById("spinner");

//  load Categories;
const loadCategories = async () => {
  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/peddy/categories"
    );
    const data = await res.json();
    displayCategories(data.categories);
  } catch (error) {
    console.error("Data fetching failed", error);
  }
};

// load all pets;
const loadAllPets = async () => {
  // loading on
  spinner.classList.remove("hidden");

  let data;
  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/peddy/pets"
    );
    data = await res.json();
  } catch (error) {
    console.error("Data fetching failed", error);
  }

  setTimeout(() => {
    displayAllPets(data.pets);
    // loading off
    spinner.classList.add("hidden");
  }, 2000);
};

// Right side
const showImg = (onlyImg) => {
  const rightSide = document.getElementById("right-side");

  const imgDiv = document.createElement("div");
  imgDiv.classList = "h-[150px]";
  imgDiv.innerHTML = `
      
        <img class="w-full h-full object-cover rounded-lg" src="${onlyImg}"/>
     
  `;

  rightSide.insertBefore(imgDiv, rightSide.firstChild);
};

// fetching category based pets
const categoryPets = async (name, id) => {
  // remove all button bg
  const categoryButtons = document.querySelectorAll(".category-btn");
  categoryButtons.forEach((btn) => {
    btn.classList.remove("bg-bg_btn", "rounded-[50px]");
  });

  //  add active button bg
  const activeBtn = document.getElementById(`btn-${id}`);
  activeBtn.classList.add("bg-bg_btn", "rounded-[50px]");

  //  clear previous all pets
  document.getElementById("pets-container").innerHTML = "";

  // loading on
  spinner.classList.remove("hidden");

  let data;
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/peddy/category/${name}`
    );
    data = await res.json();
  } catch (error) {
    console.error("Data fetching failed", error);
  }

  setTimeout(() => {
    displayAllPets(data.data);

    // loading off
    spinner.classList.add("hidden");
  }, 2000);
};

// create categories;
const displayCategories = (categories) => {
  const buttonContainer = document.getElementById("button-container");

  categories.forEach((categoryPet) => {
    // destructuring
    const { id, category, category_icon } = categoryPet;
    const categoryBtn = document.createElement("a");

    categoryBtn.innerHTML = `
    <button id="btn-${id}" onclick="categoryPets('${category}', '${id}')" class="category-btn font-bold text-2xl border py-3 px-5 rounded-xl flex items-center gap-5">
        <img class="w-10 h-10" src=${category_icon}/>
        ${category}
    </button>   
    `;

    buttonContainer.appendChild(categoryBtn);
  });
};

// display all pets;
const displayAllPets = (pets) => {
  const petsContainer = document.getElementById("pets-container");
  petsContainer.innerHTML = "";

  if (pets.length === 0) {
    petsContainer.classList.remove("grid");

    petsContainer.innerHTML = `
       <div class="w-full rounded-lg bg-[#F8F8F8] flex flex-col items-center py-44">
             <img class="w-40" src="../images/error.webp"/>
             <h2 class="text-3xl font-bold pt-6 pb-4">No Information Available</h2>
             <p class="text-gray-500 text-center">Unfortunately, we couldn't retrieve the data right now. Please try again later.</p>
       </div>
      `;
  } else {
    const petsContainer = document.getElementById("pets-container");
    petsContainer.classList.add("grid");
    pets.forEach((pet) => {
      // destructuring
      const { petId, image, pet_name, breed, date_of_birth, gender, price } =
        pet;

      const petCard = document.createElement("div");
      petCard.classList = "card bg-base-100 shadow-xl";
      petCard.innerHTML = `
             
      <div class="p-5 h-[250px]">
        <img
          src=${image ? image : "https://via.placeholder.com/150"}
          alt="Shoes"
          class="rounded-xl w-full h-full object-cover" />
      </div>
      <div class=" px-5 space-y-3">
        <h2 class="text-xl font-bold">${pet_name ? pet_name : "Not Found"}</h2>
        <div class="flex justify-start gap-2">
             <i class="text-gray-500 fa-solid fa-qrcode"></i>
             <p class="text-xs text-gray-500">Breed: ${
               breed ? breed : "Not Found"
             }</p>
       </div>
       <div class="flex justify-start gap-2">
            <i class="text-gray-500 fa-regular fa-calendar"></i>
             <p class="text-xs text-gray-500">Birth: ${
               date_of_birth ? date_of_birth : "Not Found"
             }</p>
       </div>
       <div class="flex justify-start gap-2">
             <i class="text-gray-500 fa-solid fa-mercury"></i>
             <p class="text-xs text-gray-500">Gender: ${
               gender ? gender : "Not Found"
             }</p>
       </div>
       <div class="flex justify-start gap-2 pb-1">
             <i class="text-gray-500 fa-solid fa-dollar-sign"></i>
             <p class="text-xs text-gray-500">Price: ${
               price ? `$${price}` : "Not Available"
             }</p>
       </div>
       <hr class="pb-1"/>
        <div class="flex items-center justify-between pb-5">
          <button onclick="showImg('${image}')" class="btn text-btn_primary font-black "><i class="fa-regular fa-thumbs-up"></i></button>
          <button id="adopt-btn-${petId}" onclick="showAdoptModal('${petId}')" class="btn text-btn_primary font-black ">Adopt</button>
          <button onclick="details('${petId}')" class="btn text-btn_primary font-black ">Details</button>
        </div>
      </div>
     
        `;

      petsContainer.appendChild(petCard);
    });
  }
};

// adopt modal;
const showAdoptModal = (petId) => {
  const adoptModal = document.getElementById("my_modal_1");
  adoptModal.showModal();

  document.getElementById("count-down").innerText = "3";

  modalCloseAfterCountDown(petId);
};

//   Modal will Close After CountDown
const modalCloseAfterCountDown = (petId) => {
  let countDown = 2;
  const countDownInterval = setInterval(() => {
    if (countDown > 0) {
      document.getElementById("count-down").innerText = countDown;
    }

    if (countDown <= 0) {
      clearInterval(countDownInterval);

      // close modal
      document.getElementById("my_modal_1").close();

      const adoptBtn = document.getElementById(`adopt-btn-${petId}`);
      adoptBtn.setAttribute("disabled", true);
      adoptBtn.innerText = "Adopted";
    }

    countDown--;
  }, 1000);
};

// pet details modal;
const details = async (petId) => {
  let data;
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/peddy/pet/${petId}`
    );
    data = await res.json();
  } catch (error) {
    console.error("Data fetching failed", error);
  }

  //   destructuring
  const {
    pet_name,
    breed,
    date_of_birth,
    price,
    image,
    gender,
    pet_details,
    vaccinated_status,
  } = data.petData;

  const detailsModal = document.getElementById("details-modal");
  detailsModal.innerHTML = `
  <div class="modal-box">
    <div class="text-center">
        <img src="${
          image ? image : "https://via.placeholder.com/150"
        }" class="w-full h-full rounded-lg"/>
    </div>
    <h3 class="text-2xl font-black py-5">${
      pet_name ? pet_name : "Not Found"
    }</h3>
    <div class="grid grid-cols-2 gap-2 pb-3">
        <div class="flex justify-start gap-1">
            <i class=" text-gray-500 fa-solid fa-qrcode"></i>
            <p class=" text-gray-500 text-sm">Breed: ${
              breed ? breed : "Not Found"
            }</p>
        </div>
        <div class="flex justify-start gap-2">
            <i class="text-gray-500 fa-regular fa-calendar"></i>
            <p class=" text-gray-500 text-sm">Birth: ${
              date_of_birth ? date_of_birth : "Not Found"
            }</p>
        </div>
        <div class="flex justify-start gap-2">
            <i class="text-gray-500 fa-solid fa-mercury"></i>
            <p class=" text-gray-500 text-sm">Gender: ${
              gender ? gender : "Not Found"
            }</p>
        </div>
        <div class="flex justify-start gap-2">
            <i class="text-gray-500 fa-solid fa-mercury"></i>
            <p class=" text-gray-500 text-sm">Vaccinated status: ${
              vaccinated_status ? vaccinated_status : "Not Found"
            }</p>
        </div>
        <div class="flex justify-start gap-2 pb-1">
            <i class="text-gray-500 fa-solid fa-dollar-sign"></i>
            <p class=" text-gray-500 text-sm">Price: ${
              price ? `$${price}` : "Not Available"
            }</p>
        </div> 
    </div>
        <hr class="py-3"/>
        <div class="space-y-3">
            <h3 class="text-lg font-semibold">Details Information</h3>
            <p class="text-gray-500">${
              pet_details ? pet_details : "Not Found"
            }</p>
        </div>
    <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
  `;

  detailsModal.showModal();
};

// // sorted pets by price
const sortedPetsByPrice = async () => {
  // clear category buttons bg
  const categoryButtons = document.querySelectorAll(".category-btn");
  categoryButtons.forEach((btn) => {
    btn.classList.remove("bg-bg_btn", "rounded-[50px]");
  });
  // loading on
  spinner.classList.remove("hidden");

  let data;
  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/peddy/pets"
    );
    data = await res.json();
  } catch (error) {
    console.error("data fetching failed ", error);
  }

  const sortedPets = data.pets.sort((a, b) => b.price - a.price);

  setTimeout(() => {
    displayAllPets(sortedPets);
    // loading off
    spinner.classList.add("hidden");
  }, 2000);
};

loadCategories();
loadAllPets();
