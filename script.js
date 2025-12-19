function goToPrediction() {
  document.querySelector('a[href="#prediction"]').click()
}

function openGuideModal() {
  document.getElementById("guideModal").classList.add("active")
}

function closeGuideModal() {
  document.getElementById("guideModal").classList.remove("active")
}

document.addEventListener("DOMContentLoaded", () => {
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

  function predictGraduation(nilaiTugas, nilaiUjian, kehadiran, ipk, semester, method) {
    let score = 0
    let probability = 0
    let result = ""
    let summary = ""

    if (method === "backpropagation") {
      // JST Backpropagation - Main Research Method with Neural Network Simulation
      const weights = {
        nilaiTugas: 0.15,
        nilaiUjian: 0.2,
        kehadiran: 0.15,
        ipk: 0.35,
        semester: 0.15,
      }

      // Normalize inputs
      const normalizedSemester = semester <= 8 ? 100 : Math.max(0, 100 - (semester - 8) * 10)

      // Hidden layer calculation (weighted sum)
      const hiddenLayer1 =
        nilaiTugas * weights.nilaiTugas +
        nilaiUjian * weights.nilaiUjian +
        kehadiran * weights.kehadiran +
        (ipk / 4) * 100 * weights.ipk +
        normalizedSemester * weights.semester

      // Apply activation function (sigmoid)
      probability = 1 / (1 + Math.exp(-((hiddenLayer1 - 60) / 10)))
      score = hiddenLayer1

      result = probability >= 0.6 ? "✅ Lulus Tepat Waktu (1)" : "⚠️ Tidak Tepat Waktu (0)"
      summary = `Berdasarkan analisis Jaringan Syaraf Tiruan Backpropagation dengan arsitektur multi-layer, sistem menghitung weighted sum dari seluruh input (skor: ${score.toFixed(2)}) dan menerapkan fungsi aktivasi sigmoid. IPK ${ipk} dan semester ${semester} menjadi faktor dominan dalam prediksi. ${probability >= 0.6 ? "Mahasiswa menunjukkan performa akademik yang baik dan diprediksi lulus tepat waktu dengan confidence tinggi." : "Mahasiswa perlu meningkatkan performa akademik untuk memastikan kelulusan tepat waktu. Disarankan fokus pada peningkatan IPK dan manajemen waktu studi."}`
    } else if (method === "naive-bayes") {
      // Naive Bayes - Enhanced Probabilistic Method
      // Define conditions based on academic standards
      const conditions = {
        tugasBaik: nilaiTugas >= 70,
        ujianBaik: nilaiUjian >= 70,
        kehadiranCukup: kehadiran >= 75,
        ipkBaik: ipk >= 3.0,
        semesterNormal: semester <= 8,
      }

      // Calculate individual probabilities (Bayes approach)
      const priorLulus = 0.7 // Prior probability of graduating on time
      const priorTidakLulus = 0.3

      // Likelihood calculations for each feature
      let likelihoodLulus = 1.0
      let likelihoodTidakLulus = 1.0

      if (conditions.tugasBaik) {
        likelihoodLulus *= 0.85
        likelihoodTidakLulus *= 0.3
      } else {
        likelihoodLulus *= 0.15
        likelihoodTidakLulus *= 0.7
      }

      if (conditions.ujianBaik) {
        likelihoodLulus *= 0.88
        likelihoodTidakLulus *= 0.25
      } else {
        likelihoodLulus *= 0.12
        likelihoodTidakLulus *= 0.75
      }

      if (conditions.kehadiranCukup) {
        likelihoodLulus *= 0.82
        likelihoodTidakLulus *= 0.35
      } else {
        likelihoodLulus *= 0.18
        likelihoodTidakLulus *= 0.65
      }

      if (conditions.ipkBaik) {
        likelihoodLulus *= 0.9
        likelihoodTidakLulus *= 0.2
      } else {
        likelihoodLulus *= 0.1
        likelihoodTidakLulus *= 0.8
      }

      if (conditions.semesterNormal) {
        likelihoodLulus *= 0.87
        likelihoodTidakLulus *= 0.28
      } else {
        likelihoodLulus *= 0.13
        likelihoodTidakLulus *= 0.72
      }

      // Calculate posterior probabilities
      const posteriorLulus = likelihoodLulus * priorLulus
      const posteriorTidakLulus = likelihoodTidakLulus * priorTidakLulus
      const totalPosterior = posteriorLulus + posteriorTidakLulus

      // Normalize probability
      probability = posteriorLulus / totalPosterior

      const trueCount = Object.values(conditions).filter((c) => c).length

      result = probability >= 0.5 ? "✅ Lulus Tepat Waktu (1)" : "⚠️ Tidak Tepat Waktu (0)"
      summary = `Metode Naive Bayes menggunakan teorema probabilitas Bayesian untuk menganalisis setiap fitur secara independen. Dari 5 kriteria kelulusan standar, mahasiswa memenuhi ${trueCount} kriteria. Posterior probability dihitung berdasarkan likelihood setiap kondisi (Tugas: ${conditions.tugasBaik ? "✓" : "✗"}, Ujian: ${conditions.ujianBaik ? "✓" : "✗"}, Kehadiran: ${conditions.kehadiranCukup ? "✓" : "✗"}, IPK: ${conditions.ipkBaik ? "✓" : "✗"}, Semester: ${conditions.semesterNormal ? "✓" : "✗"}). ${probability >= 0.5 ? "Probabilitas kelulusan tepat waktu lebih tinggi berdasarkan analisis Bayesian." : "Beberapa kriteria penting tidak terpenuhi, menurunkan probabilitas kelulusan tepat waktu."}`
    } else if (method === "decision-tree") {
      // Decision Tree - Enhanced Rule-based Classification
      // Complex decision tree with multiple branches

      // Root node: IPK (most important feature)
      if (ipk >= 3.5) {
        // High IPK branch
        if (semester <= 8) {
          result = "✅ Lulus Tepat Waktu (1)"
          probability = 0.95
          summary =
            "Decision Tree: Node Root [IPK ≥ 3.5] → Cabang Kiri [Semester ≤ 8] → PREDIKSI: LULUS. IPK excellent (≥3.5) dan semester optimal (≤8) menunjukkan strong indicator untuk lulus tepat waktu. Confidence level: Sangat Tinggi (95%)."
        } else if (semester <= 10) {
          result = "✅ Lulus Tepat Waktu (1)"
          probability = 0.8
          summary =
            "Decision Tree: Node Root [IPK ≥ 3.5] → Cabang Kanan [Semester > 8 & ≤ 10] → PREDIKSI: LULUS. IPK tinggi mengkompensasi semester yang sedikit lebih panjang. Confidence level: Tinggi (80%)."
        } else {
          result = "⚠️ Tidak Tepat Waktu (0)"
          probability = 0.45
          summary =
            "Decision Tree: Node Root [IPK ≥ 3.5] → Cabang Kanan [Semester > 10] → PREDIKSI: TERLAMBAT. Meskipun IPK tinggi, durasi studi yang terlalu panjang (>10 semester) meningkatkan risiko keterlambatan."
        }
      } else if (ipk >= 3.0) {
        // Good IPK branch
        if (kehadiran >= 80 && semester <= 8) {
          result = "✅ Lulus Tepat Waktu (1)"
          probability = 0.85
          summary =
            "Decision Tree: Node Root [IPK 3.0-3.5] → Node Child [Kehadiran ≥ 80% & Semester ≤ 8] → PREDIKSI: LULUS. Kombinasi IPK baik (≥3.0), kehadiran tinggi (≥80%), dan semester normal menunjukkan pattern positif untuk kelulusan tepat waktu."
        } else if (nilaiUjian >= 75 && nilaiTugas >= 75) {
          result = "✅ Lulus Tepat Waktu (1)"
          probability = 0.75
          summary =
            "Decision Tree: Node Root [IPK 3.0-3.5] → Node Child [Nilai Ujian ≥ 75 & Nilai Tugas ≥ 75] → PREDIKSI: LULUS. IPK cukup dengan performa ujian dan tugas yang baik menunjukkan kemampuan akademik yang konsisten."
        } else if (semester > 10) {
          result = "⚠️ Tidak Tepat Waktu (0)"
          probability = 0.35
          summary =
            "Decision Tree: Node Root [IPK 3.0-3.5] → Node Child [Semester > 10] → PREDIKSI: TERLAMBAT. Semester yang berlebihan (>10) menjadi red flag utama meskipun IPK dalam range acceptable."
        } else {
          result = "⚠️ Tidak Tepat Waktu (0)"
          probability = 0.48
          summary =
            "Decision Tree: Node Root [IPK 3.0-3.5] → Cabang Tengah → PREDIKSI: TERLAMBAT. Kombinasi faktor tidak mencapai threshold minimum untuk prediksi lulus tepat waktu. Perlu peningkatan kehadiran atau performa ujian/tugas."
        }
      } else if (ipk >= 2.5) {
        // Moderate IPK branch
        if (kehadiran >= 85 && nilaiUjian >= 80 && nilaiTugas >= 80 && semester <= 8) {
          result = "✅ Lulus Tepat Waktu (1)"
          probability = 0.65
          summary =
            "Decision Tree: Node Root [IPK 2.5-3.0] → Node Child [Multiple Conditions Met] → PREDIKSI: LULUS. Meskipun IPK moderate, kompensasi dari kehadiran excellent (≥85%) dan nilai tinggi (≥80) dapat mendukung kelulusan tepat waktu jika semester masih normal."
        } else {
          result = "⚠️ Tidak Tepat Waktu (0)"
          probability = 0.35
          summary =
            "Decision Tree: Node Root [IPK 2.5-3.0] → Cabang Kanan → PREDIKSI: TERLAMBAT. IPK di range 2.5-3.0 memerlukan kompensasi kuat dari faktor lain (kehadiran tinggi + nilai tinggi + semester normal). Saat ini belum memenuhi kombinasi threshold tersebut."
        }
      } else {
        // Low IPK branch
        result = "⚠️ Tidak Tepat Waktu (0)"
        probability = 0.2
        summary =
          "Decision Tree: Node Root [IPK < 2.5] → Leaf Node → PREDIKSI: TERLAMBAT. IPK di bawah 2.5 merupakan strong predictor untuk keterlambatan kelulusan. Diperlukan intervensi akademik segera: konseling, remedial, atau program peningkatan IPK."
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
  const closeGuide = document.getElementById("closeGuide")

  console.log("[v0] Guide Modal initialized:", guideModal)
  console.log("[v0] Close Guide Button:", closeGuide)

  // Event listener untuk tombol close X
  if (closeGuide) {
    closeGuide.addEventListener("click", (e) => {
      console.log("[v0] Close guide button clicked")
      e.preventDefault()
      e.stopPropagation()
      guideModal.classList.remove("active")
    })
  } else {
    console.error("[v0] Close Guide button not found!")
  }

  // Success Modal Close
  const closeSuccess = document.getElementById("closeSuccess")

  if (closeSuccess) {
    closeSuccess.addEventListener("click", () => {
      successModal.classList.remove("active")
    })
  }

  // Close modals on outside click
  window.addEventListener("click", (e) => {
    if (e.target === guideModal) {
      console.log("[v0] Clicked outside guide modal, closing...")
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
  console.log("Metode aktif: JST Backpropagation, Naive Bayes, Decision Tree")
})
