// Global variables
let umkmData = [];
let filteredData = [];
let currentSlide = 0;
let currentPage = 1;
const itemsPerPage = 6;
const viewMode = "grid";
let isDataLoaded = false;

// DOM Elements
const darkModeToggle = document.getElementById("darkModeToggle");
const darkModeToggle1 = document.getElementById("darkModeToggle1");
const hamburger = document.getElementById("hamburger");
const navMenu = document.querySelector(".nav-menu");

const alertbtn = () => alert("fitur belum berfungsi ehehehehe");

// Initialize the application
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM Content Loaded");

  initializeDarkMode();
  initializeNavigation();

  // Load data first
  await loadUMKMData();

  // Page-specific initialization
  const currentPageName = getCurrentPage();
  console.log("Current page:", currentPageName);

  switch (currentPageName) {
    case "index":
      initializeHomePage();
      break;
    case "umkm":
      initializeUMKMPage();
      break;
    case "about":
      initializeAboutPage();
      break;
    case "detail":
      initializeDetailPage();
      break;
  }

  // Initialize animations after content is loaded
  setTimeout(() => {
    initializeAnimations();
  }, 100);
});

// Get current page
function getCurrentPage() {
  const path = window.location.pathname;
  if (path.includes("umkm.html")) return "umkm";
  if (path.includes("about.html")) return "about";
  if (path.includes("detail.html")) return "detail";
  return "index";
}

// Custom cursor
function initializeCustomCursor() {
  const cursor = document.querySelector(".cursor");
  const cursorFollower = document.querySelector(".cursor-follower");

  if (window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";

      // Add a slight delay to follower for smooth effect
      setTimeout(() => {
        cursorFollower.style.left = e.clientX + "px";
        cursorFollower.style.top = e.clientY + "px";
      }, 50);
    });

    // Change cursor size on links and buttons
    document
      .querySelectorAll("a, button, .umkm-card, .benefit-card")
      .forEach((item) => {
        item.addEventListener("mouseenter", () => {
          cursor.style.width = "0";
          cursor.style.height = "0";
          cursorFollower.style.width = "50px";
          cursorFollower.style.height = "50px";
          cursorFollower.style.borderWidth = "3px";
        });

        item.addEventListener("mouseleave", () => {
          cursor.style.width = "10px";
          cursor.style.height = "10px";
          cursorFollower.style.width = "30px";
          cursorFollower.style.height = "30px";
          cursorFollower.style.borderWidth = "2px";
        });
      });
  }
}

// Dark mode functionality
function initializeDarkMode() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateDarkModeButton(savedTheme);

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", toggleDarkMode);
  }
  if (darkModeToggle1) {
    darkModeToggle1.addEventListener("click", toggleDarkMode);
  }
}

function toggleDarkMode() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateDarkModeButton(newTheme);
}

function updateDarkModeButton(theme) {
  if (darkModeToggle1) {
    darkModeToggle1.textContent = theme === "dark" ? "☀️" : "🌙";
  }
  if (darkModeToggle) {
    darkModeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

// Navigation functionality
function initializeNavigation() {
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("active");
    });

    // Close menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
      }
    });
  }
}

// Animation functionality
function initializeAnimations() {
  console.log("Initializing animations");

  // Reveal animations on scroll
  const revealElements = document.querySelectorAll(".reveal-item");
  console.log("Found reveal elements:", revealElements.length);

  const revealOnScroll = () => {
    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const delay = Number.parseInt(element.dataset.delay) || 0;

      if (elementTop < windowHeight - 100) {
        setTimeout(() => {
          element.classList.add("revealed");
        }, delay);
      }
    });

    // Animate stat counters
    const statElements = document.querySelectorAll(".stat-number");
    statElements.forEach((stat) => {
      const elementTop = stat.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (
        elementTop < windowHeight - 100 &&
        !stat.classList.contains("animated")
      ) {
        stat.classList.add("animated");
        animateCounter(stat);
      }
    });
  };

  // Run once on load
  revealOnScroll();

  // Add scroll event listener with throttle
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        revealOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
}

function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute("data-count"));
  if (!target) return;

  const originalText = element.textContent;
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = originalText;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Load UMKM data
async function loadUMKMData() {
  console.log("Loading UMKM data...");

  try {
    const response = await fetch("../data/data.json");
    if (response.ok) {
      umkmData = await response.json();
      console.log("Data loaded from JSON:", umkmData.length, "items");
    } else {
      throw new Error("Failed to fetch data.json");
    }
  } catch (error) {
    console.error("Error loading UMKM data:", error);
    console.log("Using fallback data");
    umkmData = getFallbackData();
  }

  filteredData = [...umkmData];
  isDataLoaded = true;
  console.log("UMKM data loaded successfully:", umkmData.length, "items");
}

// Fallback data
function getFallbackData() {
  return [
    {
      id: 1,
      nama: "Warung Nasi Gudeg Bu Sari",
      kategori: "makanan",
      deskripsi:
        "Warung gudeg tradisional dengan cita rasa autentik Yogyakarta yang telah berdiri sejak 1985.",
      gambar: "https://picsum.photos/400/300?random=1",
      lokasi: "Yogyakarta",
      kontak: {
        whatsapp: "+62812-3456-7890",
        email: "gudegbusari@gmail.com",
        alamat: "Jl. Malioboro No. 123, Yogyakarta",
      },
      produk: [
        "Gudeg Ayam",
        "Gudeg Kambing",
        "Tahu Bacem",
        "Tempe Bacem",
        "Krecek",
      ],
      unggulan: true,
    },
    {
      id: 2,
      nama: "Kerajinan Batik Indah",
      kategori: "kerajinan",
      deskripsi:
        "Pengrajin batik tulis dan cap dengan motif tradisional dan kontemporer berkualitas tinggi.",
      gambar: "https://picsum.photos/400/300?random=2",
      lokasi: "Solo",
      kontak: {
        whatsapp: "+62813-4567-8901",
        email: "batikindah@yahoo.com",
        alamat: "Jl. Slamet Riyadi No. 456, Solo",
      },
      produk: [
        "Batik Tulis",
        "Batik Cap",
        "Kemeja Batik",
        "Dress Batik",
        "Selendang",
      ],
      unggulan: true,
    },
    {
      id: 3,
      nama: "Toko Kopi Arabika Gayo",
      kategori: "makanan",
      deskripsi:
        "Penjual kopi arabika premium dari dataran tinggi Gayo, Aceh dengan proses roasting terbaik.",
      gambar: "https://picsum.photos/400/300?random=3",
      lokasi: "Aceh",
      kontak: {
        whatsapp: "+62814-5678-9012",
        email: "kopigayo@gmail.com",
        alamat: "Jl. Teuku Umar No. 789, Banda Aceh",
      },
      produk: [
        "Kopi Arabika Gayo",
        "Kopi Robusta",
        "Kopi Bubuk",
        "Kopi Biji",
        "Cold Brew",
      ],
      unggulan: false,
    },
    {
      id: 4,
      nama: "Fashion Hijab Modern",
      kategori: "fashion",
      deskripsi:
        "Butik hijab dengan desain modern dan bahan berkualitas untuk wanita muslimah masa kini.",
      gambar: "https://picsum.photos/400/300?random=4",
      lokasi: "Bandung",
      kontak: {
        whatsapp: "+62815-6789-0123",
        email: "hijabmodern@gmail.com",
        alamat: "Jl. Dago No. 321, Bandung",
      },
      produk: ["Hijab Segi Empat", "Hijab Instan", "Gamis", "Tunik", "Khimar"],
      unggulan: false,
    },
    {
      id: 5,
      nama: "Aplikasi Kasir Digital SmartPOS",
      kategori: "teknologi",
      deskripsi:
        "Pengembang aplikasi kasir digital untuk UMKM dengan fitur lengkap dan mudah digunakan.",
      gambar: "https://picsum.photos/400/300?random=5",
      lokasi: "Jakarta",
      kontak: {
        whatsapp: "+62816-7890-1234",
        email: "smartpos@tech.com",
        alamat: "Jl. Sudirman No. 654, Jakarta",
      },
      produk: [
        "Aplikasi Kasir",
        "Sistem Inventory",
        "Laporan Penjualan",
        "Integrasi Payment",
        "Training",
      ],
      unggulan: false,
    },
    {
      id: 6,
      nama: "Jasa Desain Grafis Kreatif",
      kategori: "jasa",
      deskripsi:
        "Layanan desain grafis profesional untuk branding, packaging, dan kebutuhan promosi UMKM.",
      gambar: "https://picsum.photos/400/300?random=6",
      lokasi: "Surabaya",
      kontak: {
        whatsapp: "+62817-8901-2345",
        email: "desainkreatif@gmail.com",
        alamat: "Jl. Pemuda No. 987, Surabaya",
      },
      produk: [
        "Logo Design",
        "Packaging Design",
        "Banner",
        "Brosur",
        "Social Media Kit",
      ],
      unggulan: false,
    },
    {
      id: 7,
      nama: "Keripik Singkong Renyah",
      kategori: "makanan",
      deskripsi:
        "Produsen keripik singkong dengan berbagai varian rasa yang renyah dan gurih.",
      gambar: "https://picsum.photos/400/300?random=7",
      lokasi: "Malang",
      kontak: {
        whatsapp: "+62818-9012-3456",
        email: "keripiksingkong@gmail.com",
        alamat: "Jl. Veteran No. 234, Malang",
      },
      produk: [
        "Keripik Original",
        "Keripik Balado",
        "Keripik BBQ",
        "Keripik Keju",
      ],
      unggulan: false,
    },
    {
      id: 8,
      nama: "Furniture Kayu Jati",
      kategori: "kerajinan",
      deskripsi:
        "Pengrajin furniture kayu jati berkualitas tinggi dengan desain klasik dan modern.",
      gambar: "https://picsum.photos/400/300?random=8",
      lokasi: "Jepara",
      kontak: {
        whatsapp: "+62819-0123-4567",
        email: "furniturejati@yahoo.com",
        alamat: "Jl. Kartini No. 567, Jepara",
      },
      produk: [
        "Meja Makan",
        "Kursi Tamu",
        "Lemari Pakaian",
        "Tempat Tidur",
        "Rak Buku",
      ],
      unggulan: false,
    },
  ];
}

// Home page initialization
function initializeHomePage() {
  console.log("Initializing home page");
  displayFeaturedUMKM();
  initializeTestimonialSlider();
}

// Display featured UMKM on home page
function displayFeaturedUMKM() {
  const featuredContainer = document.getElementById("featuredUMKM");
  if (!featuredContainer) {
    console.log("Featured container not found");
    return;
  }

  if (!isDataLoaded || umkmData.length === 0) {
    console.log("Data not loaded yet");
    featuredContainer.innerHTML =
      '<div class="loading"><div class="loading-spinner"></div></div>';
    return;
  }

  const featuredUMKM = umkmData.filter((umkm) => umkm.unggulan).slice(0, 4);
  console.log("Featured UMKM:", featuredUMKM.length);

  featuredContainer.innerHTML = featuredUMKM
    .map(
      (umkm, index) => `
        <div class="umkm-card reveal-item" data-delay="${index * 100}">
            <img src="${umkm.gambar}" alt="${umkm.nama}" loading="lazy">
            <div class="umkm-card-content">
                <span class="umkm-category">${getCategoryName(
                  umkm.kategori
                )}</span>
                <h3>${umkm.nama}</h3>
                <p>${umkm.deskripsi}</p>
                  <a href="detail.html?id=${
                    umkm.id
                  }" class="btn-primary detail-button">
                    Lihat Detail
                </a>
            </div>
        </div>
    `
    )
    .join("");
}

// Testimonial slider
function initializeTestimonialSlider() {
  const track = document.querySelector(".testimonial-track");
  const prevBtn = document.querySelector(".testimonial-prev");
  const nextBtn = document.querySelector(".testimonial-next");

  if (!track || !prevBtn || !nextBtn) return;

  const slides = document.querySelectorAll(".testimonial-item");
  const totalSlides = slides.length;

  if (totalSlides === 0) return;

  function updateSlider() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  prevBtn.addEventListener("click", () => {
    currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
    updateSlider();
  });

  nextBtn.addEventListener("click", () => {
    currentSlide = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
    updateSlider();
  });

  // Auto-play slider
  setInterval(() => {
    currentSlide = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
    updateSlider();
  }, 5000);
}

// UMKM page initialization
function initializeUMKMPage() {
  console.log("Initializing UMKM page");

  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const categoryFilter = document.getElementById("categoryFilter");

  if (searchInput) {
    searchInput.addEventListener("input", debounce(filterUMKM, 300));
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", filterUMKM);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterUMKM);
  }

  // Display all UMKM initially
  displayAllUMKM();
}

// Display all UMKM
function displayAllUMKM() {
  const umkmGrid = document.getElementById("umkmGrid");
  const noResults = document.getElementById("noResults");
  const resultsCount = document.getElementById("resultsCount");

  if (!umkmGrid) {
    console.log("UMKM grid container not found");
    return;
  }

  if (!isDataLoaded) {
    console.log("Data not loaded yet, showing loading");
    umkmGrid.innerHTML =
      '<div class="loading"><div class="loading-spinner"></div></div>';
    if (resultsCount) resultsCount.textContent = "Memuat data...";
    return;
  }

  console.log("Displaying UMKM data:", filteredData.length, "items");

  if (filteredData.length === 0) {
    umkmGrid.innerHTML = "";
    if (noResults) noResults.style.display = "block";
    if (resultsCount) resultsCount.textContent = "Tidak ada hasil ditemukan";
    return;
  }

  if (noResults) noResults.style.display = "none";

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  console.log("Paginated data:", paginatedData.length, "items");

  // Update results count
  if (resultsCount) {
    resultsCount.textContent = `Menampilkan ${startIndex + 1}-${Math.min(
      endIndex,
      filteredData.length
    )} dari ${filteredData.length} UMKM`;
  }

  umkmGrid.innerHTML = paginatedData
    .map(
      (umkm, index) => `
        <article class="umkm-card reveal-item" data-delay="${index * 100}">
            <img src="${umkm.gambar}" alt="${umkm.nama}" loading="lazy">
            <div class="umkm-card-content">
                <span class="umkm-category">${getCategoryName(
                  umkm.kategori
                )}</span>
                <h3>${umkm.nama}</h3>
                <p>${umkm.deskripsi}</p>
                 <a href="detail.html?id=${
                   umkm.id
                 }" class="btn-primary detail-button">
                    Lihat Detail
                </a>
            </div>
        </article>
    `
    )
    .join("");

  updatePagination();
  updateFilterTags();

  // Re-initialize animations for new content
  setTimeout(() => {
    initializeAnimations();
  }, 100);
}

// Update pagination
function updatePagination() {
  const paginationContainer = document.getElementById("pagination");
  if (!paginationContainer) return;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let paginationHTML = "";

  // Previous button
  if (currentPage > 1) {
    paginationHTML += `<button class="page-btn" onclick="changePage(${
      currentPage - 1
    })">‹</button>`;
  }

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      paginationHTML += `<button class="page-btn active">${i}</button>`;
    } else {
      paginationHTML += `<button class="page-btn" onclick="changePage(${i})">${i}</button>`;
    }
  }

  // Next button
  if (currentPage < totalPages) {
    paginationHTML += `<button class="page-btn" onclick="changePage(${
      currentPage + 1
    })">›</button>`;
  }

  paginationContainer.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
  currentPage = page;
  displayAllUMKM();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Update filter tags
function updateFilterTags() {
  const filterTagsContainer = document.getElementById("filterTags");
  if (!filterTagsContainer) return;

  const searchTerm = document.getElementById("searchInput")?.value || "";
  const selectedCategory =
    document.getElementById("categoryFilter")?.value || "";

  let tagsHTML = "";

  if (searchTerm) {
    tagsHTML += `<span class="filter-tag">
        Pencarian: "${searchTerm}"
        <i onclick="clearSearch()">×</i>
    </span>`;
  }

  if (selectedCategory) {
    tagsHTML += `<span class="filter-tag">
        Kategori: ${getCategoryName(selectedCategory)}
        <i onclick="clearCategory()">×</i>
    </span>`;
  }

  filterTagsContainer.innerHTML = tagsHTML;
}

// Clear search
function clearSearch() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.value = "";
    filterUMKM();
  }
}

// Clear category
function clearCategory() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    categoryFilter.value = "";
    filterUMKM();
  }
}

// Filter UMKM
function filterUMKM() {
  const searchTerm =
    document.getElementById("searchInput")?.value.toLowerCase() || "";
  const selectedCategory =
    document.getElementById("categoryFilter")?.value || "";

  console.log("Filtering with:", { searchTerm, selectedCategory });

  filteredData = umkmData.filter((umkm) => {
    const matchesSearch =
      umkm.nama.toLowerCase().includes(searchTerm) ||
      umkm.deskripsi.toLowerCase().includes(searchTerm) ||
      umkm.produk.some((produk) => produk.toLowerCase().includes(searchTerm));

    const matchesCategory =
      !selectedCategory || umkm.kategori === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  console.log("Filtered results:", filteredData.length);

  currentPage = 1; // Reset to first page
  displayAllUMKM();
}

// Detail page initialization
function initializeDetailPage() {
  console.log("Initializing detail page");

  const urlParams = new URLSearchParams(window.location.search);
  const umkmId = parseInt(urlParams.get("id"));

  if (umkmId) {
    displayUMKMDetail(umkmId);
    displayRelatedUMKM(umkmId);
  } else {
    window.location.href = "umkm.html";
  }
}

// Display UMKM detail
async function displayUMKMDetail(id) {
  const detailContainer = document.getElementById("umkmDetail");

  if (!isDataLoaded) {
    await loadUMKMData();
  }

  const umkm = umkmData.find((u) => u.id === id);

  if (!umkm) {
    detailContainer.innerHTML = `
      <div class="no-results">
        <h3>UMKM tidak ditemukan</h3>
        <p>Maaf, data UMKM yang Anda cari tidak tersedia.</p>
      </div>`;
    return;
  }

  detailContainer.innerHTML = `
    <div class="detail-header animate-fade-in">
      <div class="detail-image">
        <img src="${umkm.gambar}" alt="${umkm.nama}">
      </div>
      <div class="detail-info">
        <h1>${umkm.nama}</h1>
        <span class="category">${getCategoryName(umkm.kategori)}</span>
        <p><strong><i class="fas fa-map-marker-alt"></i> Lokasi:</strong> ${
          umkm.lokasi
        }</p>
        <iframe class="map" style="border-radius:10px;" src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d28840.52512505532!2d119.88832233184472!3d-0.8921244288559399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1749144624374!5m2!1sen!2sid" width="400" height="270" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
    
    <div class="detail-description animate-slide-up">
      <h2>Tentang Usaha</h2>
      <p>${umkm.deskripsi}</p>
    </div>
    
    <div class="products-section animate-slide-up">
      <h2>Produk & Layanan</h2>
      <div class="products-grid">
        ${umkm.produk
          .map(
            (produk) => `
          <div class="product-item">
            <h3>${produk}</h3>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
    
    <div class="contact-section animate-slide-up">
      <h2>Informasi Kontak</h2>
      <div class="contact-info">
        <div class="contact-item">
          <i class="fab fa-whatsapp"></i>
          <div>
            <strong>WhatsApp:</strong><br>
            <a href="https://wa.me/${umkm.kontak.whatsapp.replace(
              /[^0-9]/g,
              ""
            )}" 
               target="_blank" rel="noopener">
              ${umkm.kontak.whatsapp}
            </a>
          </div>
        </div>
        <div class="contact-item">
          <i class="fas fa-envelope"></i>
          <div>
            <strong>Email:</strong><br>
            <a href="mailto:${umkm.kontak.email}">${umkm.kontak.email}</a>
          </div>
        </div>
        <div class="contact-item">
          <i class="fas fa-map-marker-alt"></i>
          <div>
            <strong>Alamat:</strong><br>
            ${umkm.kontak.alamat}
          </div>
        </div>
      </div>
    </div>`;
}

// Display related UMKM
function displayRelatedUMKM(currentId) {
  const relatedContainer = document.getElementById("relatedUMKM");
  if (!relatedContainer) return;

  const currentUMKM = umkmData.find((u) => u.id === currentId);
  if (!currentUMKM) return;

  const relatedUMKM = umkmData
    .filter(
      (umkm) => umkm.id !== currentId && umkm.kategori === currentUMKM.kategori
    )
    .slice(0, 3);

  if (relatedUMKM.length === 0) {
    document.querySelector(".related-umkm").style.display = "none";
    return;
  }

  relatedContainer.innerHTML = relatedUMKM
    .map(
      (umkm, index) => `
        <article class="umkm-card reveal-item" data-delay="${index * 200}">
            <img src="${umkm.gambar}" alt="${umkm.nama}" loading="lazy">
            <div class="umkm-card-content">
                <span class="umkm-category">${getCategoryName(
                  umkm.kategori
                )}</span>
                <h3>${umkm.nama}</h3>
                <p>${umkm.deskripsi}</p>
                        <a href="detail.html?id=${
                          umkm.id
                        }" class="btn-primary detail-button">
                    Lihat Detail
                </a>
            </div>
        </article>
    `
    )
    .join("");
}

// About page initialization
function initializeAboutPage() {
  console.log("About page initialized");
}

// Utility functions
function getCategoryName(category) {
  const categories = {
    makanan: "Makanan & Minuman",
    kerajinan: "Kerajinan",
    fashion: "Fashion",
    teknologi: "Teknologi",
    jasa: "Jasa",
  };
  return categories[category] || category;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Error handling for images
document.addEventListener(
  "error",
  (e) => {
    if (e.target.tagName === "IMG") {
      e.target.src = "https://picsum.photos/400/300?random=placeholder";
    }
  },
  true
);

// Smooth scrolling for anchor links
document.addEventListener("click", (e) => {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
});

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector(".hero-background");

  if (parallax) {
    const speed = scrolled * 0.5;
    parallax.style.transform = `translateY(${speed}px)`;
  }
});

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// Smooth scrolling enhancement
function initializeSmoothScroll() {
  // Add smooth scrolling to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Make functions global for onclick handlers
window.changePage = changePage;
window.clearSearch = clearSearch;
window.clearCategory = clearCategory;
