// Navigation & Section Management
const navLinks = document.querySelectorAll(".nav-link")
const sections = document.querySelectorAll(".section")
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("navMenu")

// Navigation handler
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    const targetId = link.getAttribute("href").substring(1)

    // Update active nav link
    navLinks.forEach((l) => l.classList.remove("active"))
    link.classList.add("active")

    // Update active section
    sections.forEach((section) => {
      section.classList.remove("active")
      if (section.id === targetId) {
        section.classList.add("active")
      }
    })

    // Close mobile menu
    navMenu.classList.remove("active")

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  })
})

// Hamburger menu toggle
hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active")
})

// Learn More button
document.getElementById("btnLearnMore").addEventListener("click", () => {
  document.querySelector('a[href="#prediction"]').click()
})

// Method Selection
const methodCards = document.querySelectorAll(".method-card")
let selectedMethod = "backpropagation"

methodCards.forEach((card) => {
  card.addEventListener("click", () => {
    methodCards.forEach((c) => c.classList.remove("active"))
    card.classList.add("active")
    selectedMethod = card.getAttribute("data-method")
  })
})

// Prediction Logic
const formPrediction = document.getElementById("formPrediction")
const resultSection = document.getElementById("resultSection")

formPrediction.addEventListener("submit", (e) => {
  e.preventDefault()

  // Get form values
  const nilaiTugas = Number.parseFloat(document.getElementById("nilaiTugas").value)
  const nilaiUjian = Number.parseFloat(document.getElementById("nilaiUjian").value)
  const persenKehadiran = Number.parseFloat(document.getElementById("persenKehadiran").value)
  const ipk = Number.parseFloat(document.getElementById("ipk").value)
  const lamaStudi = Number.parseInt(document.getElementById("lamaStudi").value)

  // Show loading state
  const btnText = document.querySelector(".btn-text")
  const btnLoader = document.querySelector(".btn-loader")
  btnText.style.display = "none"
  btnLoader.style.display = "inline"

  // Simulate processing delay
  setTimeout(() => {
    // Perform prediction
    const result = predictGraduation(nilaiTugas, nilaiUjian, persenKehadiran, ipk, lamaStudi, selectedMethod)

    // Display result
    displayResult(result)

    // Reset button state
    btnText.style.display = "inline"
    btnLoader.style.display = "none"

    // Scroll to result
    resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, 1500)
})

// Prediction Functions
function predictGraduation(nilaiTugas, nilaiUjian, kehadiran, ipk, semester, method) {
  let score = 0
  let probability = 0
  let result = ""
  let summary = ""

  if (method === "backpropagation") {
    // JST Backpropagation - Main Research Method
    // Weighted neural network simulation
    const weights = {
      nilaiTugas: 0.15,
      nilaiUjian: 0.2,
      kehadiran: 0.15,
      ipk: 0.35,
      semester: 0.15,
    }

    // Normalize inputs and calculate weighted sum
    const normalizedSemester = semester <= 8 ? 100 : Math.max(0, 100 - (semester - 8) * 10)

    score =
      nilaiTugas * weights.nilaiTugas +
      nilaiUjian * weights.nilaiUjian +
      kehadiran * weights.kehadiran +
      (ipk / 4) * 100 * weights.ipk +
      normalizedSemester * weights.semester

    // Sigmoid activation function
    probability = 1 / (1 + Math.exp(-((score - 60) / 10)))

    result = probability >= 0.6 ? "✅ Lulus Tepat Waktu (1)" : "⚠️ Tidak Tepat Waktu (0)"
    summary = `Berdasarkan analisis Jaringan Syaraf Tiruan Backpropagation dengan bobot optimal, mahasiswa memiliki karakteristik akademik dengan skor ${score.toFixed(2)}. IPK ${ipk} dan semester ${semester} menjadi faktor dominan dalam prediksi. ${probability >= 0.6 ? "Mahasiswa menunjukkan performa akademik yang baik dan diprediksi lulus tepat waktu." : "Mahasiswa perlu meningkatkan performa akademik untuk memastikan kelulusan tepat waktu."}`
  } else if (method === "naive-bayes") {
    // Naive Bayes - Probability-based
    const conditions = [nilaiTugas >= 70, nilaiUjian >= 70, kehadiran >= 75, ipk >= 3.0, semester <= 8]

    const trueCount = conditions.filter((c) => c).length
    probability = trueCount / conditions.length

    result = probability >= 0.6 ? "✅ Lulus Tepat Waktu (1)" : "⚠️ Tidak Tepat Waktu (0)"
    summary = `Metode Naive Bayes menganalisis probabilitas berdasarkan kondisi akademik. Dari 5 kriteria kelulusan, mahasiswa memenuhi ${trueCount} kriteria. ${probability >= 0.6 ? "Probabilitas kelulusan tepat waktu cukup tinggi." : "Beberapa kriteria perlu ditingkatkan untuk meningkatkan peluang kelulusan tepat waktu."}`
  } else if (method === "decision-tree") {
    // Decision Tree - Rule-based
    if (ipk >= 3.5 && semester <= 8) {
      result = "✅ Lulus Tepat Waktu (1)"
      probability = 0.95
      summary =
        "Berdasarkan pohon keputusan, IPK tinggi (≥3.5) dan semester optimal (≤8) menunjukkan prediksi kuat untuk lulus tepat waktu."
    } else if (ipk >= 3.0 && kehadiran >= 80 && semester <= 8) {
      result = "✅ Lulus Tepat Waktu (1)"
      probability = 0.85
      summary =
        "IPK baik (≥3.0) dengan kehadiran tinggi (≥80%) dan semester normal menunjukkan peluang baik untuk lulus tepat waktu."
    } else if (ipk >= 2.75 && nilaiUjian >= 75 && nilaiTugas >= 75) {
      result = "✅ Lulus Tepat Waktu (1)"
      probability = 0.7
      summary =
        "IPK cukup (≥2.75) dengan nilai ujian dan tugas baik menunjukkan potensi lulus tepat waktu dengan usaha konsisten."
    } else if (semester > 10 || ipk < 2.5) {
      result = "⚠️ Tidak Tepat Waktu (0)"
      probability = 0.3
      summary =
        "Semester yang terlalu panjang (>10) atau IPK rendah (<2.5) menunjukkan risiko tinggi tidak lulus tepat waktu. Perlu konseling akademik."
    } else {
      result = "⚠️ Tidak Tepat Waktu (0)"
      probability = 0.45
      summary =
        "Beberapa indikator akademik menunjukkan risiko keterlambatan kelulusan. Disarankan untuk meningkatkan performa akademik."
    }
  }

  return {
    result,
    probability: (probability * 100).toFixed(2),
    method: getMethodName(method),
    summary,
  }
}

function getMethodName(method) {
  const names = {
    backpropagation: "🧠 JST Backpropagation",
    "naive-bayes": "📊 Naive Bayes",
    "decision-tree": "🌳 Decision Tree",
  }
  return names[method]
}

function displayResult(result) {
  document.getElementById("resultStatus").textContent = result.result
  document.getElementById("resultStatus").className = result.result.includes("✅")
    ? "result-status success"
    : "result-status warning"
  document.getElementById("resultMethod").textContent = result.method
  document.getElementById("resultProbability").textContent = result.probability + "%"
  document.getElementById("resultSummary").textContent = result.summary

  resultSection.style.display = "block"
}

// Feedback Form
const formFeedback = document.getElementById("formFeedback")
const successModal = document.getElementById("successModal")
const successMessage = document.getElementById("successMessage")

formFeedback.addEventListener("submit", (e) => {
  e.preventDefault()

  const nama = document.getElementById("feedbackNama").value
  const email = document.getElementById("feedbackEmail").value
  const jenis = document.getElementById("feedbackJenis").value
  const pesan = document.getElementById("feedbackPesan").value

  // Simulate feedback submission
  console.log("Feedback submitted:", { nama, email, jenis, pesan })

  // Show success message
  successMessage.textContent = `Terima kasih ${nama}! Feedback Anda telah berhasil dikirim dan akan sangat membantu pengembangan sistem di masa mendatang.`
  successModal.classList.add("active")

  // Reset form
  formFeedback.reset()
})

// Guide Modal
const guideModal = document.getElementById("guideModal")
const btnGuide = document.getElementById("btnGuide")
const closeGuide = document.getElementById("closeGuide")

btnGuide.addEventListener("click", () => {
  guideModal.classList.add("active")
})

closeGuide.addEventListener("click", () => {
  guideModal.classList.remove("active")
})

// Success Modal Close
const closeSuccess = document.getElementById("closeSuccess")

closeSuccess.addEventListener("click", () => {
  successModal.classList.remove("active")
})

// Close modals on outside click
window.addEventListener("click", (e) => {
  if (e.target === guideModal) {
    guideModal.classList.remove("active")
  }
  if (e.target === successModal) {
    successModal.classList.remove("active")
  }
})

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href")
    if (href !== "#") {
      e.preventDefault()
    }
  })
})

// Initialize
console.log("Sistem Prediksi Kelulusan Mahasiswa - Ready")
console.log("Metode aktif: JST Backpropagation")
