export interface Project {
  slug: string;
  title: string;
  year: string;
  problem: string;
  solution: string;
  result: string;
  stack: string[];
  repoUrl: string | null;
  liveUrl: string | null;
  /** Decorative cover image stored locally in public/projects/ (see CREDITS.md) */
  coverImage: string;
  imageTodo: string;
  metricsTodo: string;
  accentTone: string;
}

export interface ExperienceItem {
  role: string;
  organization: string;
  period: string;
  description: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface SoftSkill {
  title: string;
  detail: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  faculty: string;
  expectedGraduation: string;
  gpa: string;
}

export const PORTFOLIO = {
  name: "Mohamed Said Mohamed Elhosiny",
  shortName: "Mohamed Elhosiny",
  role: "Aspiring AI Engineer | NLP & Generative AI",
  email: "mohamedsaidelhosiny@gmail.com",
  phone: "01225578877",
  location: "10th of Ramadan City, Egypt",
  locationMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=10th+of+Ramadan+City%2C+Egypt",
  githubUrl: "https://github.com/Mano865",
  linkedinUrl: "https://linkedin.com/in/mohamed-elhosiny-54a219322",

  hero: {
    headline:
      "Building and fine-tuning machine learning, NLP, and generative AI systems.",
    subheadline:
      "Aspiring AI Engineer focused on taking Python ML and deep learning projects from data preprocessing through model evaluation across translation, classification, and signal-processing tasks.",
    primaryCta: "View projects",
    secondaryCta: "Get in touch",
  },

  about: {
    lead: "Hands-on experience building and fine-tuning machine learning and deep learning models in Python, with a focus on NLP, computer vision, and generative AI.",
    body: [
      "My work spans the full ML workflow—from data preprocessing, feature engineering, and vision/NLP model fine-tuning to metaheuristic hyperparameter tuning, systematic evaluation, and cross-platform deployment across crop disease detection, translation, text classification, medical image segmentation, and audio signal processing.",
      "I am currently pursuing a B.Sc. in AI Engineering at New Ismailia National University and seeking to apply strong technical fundamentals and a continuous-learning mindset to a growing AI/ML team.",
    ],
    softSkills: [
      {
        title: "Teamwork & Collaboration",
        detail:
          "Contributed as part of a six-member robotics team, owning motor control and embedded programming.",
      },
      {
        title: "Problem-Solving & Critical Thinking",
        detail:
          "Debugged and iterated on multiple ML training pipelines independently.",
      },
      {
        title: "Time Management & Adaptability",
        detail:
          "Balanced university coursework, ITI and NTI training programs, and personal projects in parallel.",
      },
      {
        title: "Communication",
        detail:
          "Documented and presented technical projects clearly to academic and non-technical audiences.",
      },
    ] satisfies SoftSkill[],
  },

  projects: [
    {
      slug: "agrisense-smart-agriculture",
      title: "AgriSense — Smart Agriculture & Crop Disease Detection",
      year: "2026",
      problem:
        "Farmers and researchers need a single, accessible cross-platform tool to detect plant diseases—including Fall Armyworm (FAW)—and monitor crop trends and local weather conditions.",
      solution:
        "Built a cross-platform Flutter/Dart app (Android, iOS, and Web) powered by EfficientNet-B4 (PyTorch) extended to 39 crop disease classes including FAW, with a 7-day crop/FAW trend chart, Open-Meteo weather and geolocation card supporting farmer and researcher modes, chat with photo/voice uploads via Supabase Storage, Firebase Auth (email/password & Google Sign-In), and full security audit fixes.",
      result:
        "Delivered a unified mobile and web smart agriculture platform combining 39-class AI crop disease detection, live weather and 7-day FAW trend tracking, multimodal chat, and audited authentication.",
      stack: [
        "Flutter",
        "Dart",
        "EfficientNet-B4 (PyTorch)",
        "Firebase Auth",
        "Google Sign-In",
        "Supabase Storage",
        "Open-Meteo API",
        "Google Colab",
      ],
      // TODO: Add AgriSense GitHub repository URL and live Web demo URL
      repoUrl: null,
      liveUrl: null,
      coverImage: "/projects/agrisense.webp",
      imageTodo: "Custom AgriSense mobile + web mockup cover with official logo",
      metricsTodo: "TODO: Add GitHub repo / live demo links and test accuracy metrics",
      accentTone: "#52A856",
    },
    {
      slug: "brain-tumor-segmentation-unet-pso",
      title: "Brain Tumor Segmentation using U-Net and PSO",
      year: "2026",
      problem:
        "Segmenting brain tumors accurately from MRI scans requires effective deep learning architectures and well-tuned hyperparameters.",
      solution:
        "Built a U-Net deep learning segmentation model with preprocessing, data augmentation, and Particle Swarm Optimization (PSO) for hyperparameter tuning.",
      result:
        "Evaluated segmentation quality using Dice Score and Intersection over Union (IoU) metrics.",
      stack: ["Python", "U-Net", "Deep Learning", "PSO"],
      repoUrl: "https://github.com/Mano865/Brain-Tumor-Segmentation-U-Net-PSO-",
      liveUrl: null,
      coverImage: "/projects/brain-tumor-segmentation.webp",
      imageTodo: "TODO: Replace decorative cover with real MRI segmentation output when ready",
      metricsTodo: "TODO: Add exact Dice Score and IoU values",
      accentTone: "#D4A373",
    },
    {
      slug: "english-to-egyptian-arabic-mt",
      title: "Machine Translation: English to Egyptian Arabic",
      year: "2025",
      problem:
        "Standard Modern Standard Arabic (MSA) translation models do not reliably handle Egyptian Arabic dialect expressions.",
      solution:
        "Fine-tuned the Helsinki-NLP/opus-mt-en-ar transformer (Hugging Face) on the HeshamHaroon/ArzEn-MultiGenre parallel corpus with dialect-specific preprocessing.",
      result:
        "Built and evaluated a dialect-aware translation pipeline tailored to Egyptian Arabic.",
      stack: ["Python", "Hugging Face Transformers", "NLP", "Machine Translation"],
      repoUrl: "https://github.com/Mano865/Machine-Translation-",
      liveUrl: null,
      coverImage: "/projects/machine-translation.webp",
      imageTodo: "TODO: Replace decorative cover with real translation example screenshot when ready",
      metricsTodo: "TODO: Add BLEU/chrF evaluation metrics",
      accentTone: "#8FA8BF",
    },
    {
      slug: "sms-spam-detection-gwo",
      title: "SMS Spam Detection with Grey Wolf Optimizer (GWO)",
      year: "2025",
      problem:
        "Manual and grid-search hyperparameter tuning for recurrent text classifiers is time-consuming and can miss stronger configurations.",
      solution:
        "Built an LSTM-based spam classifier over a standard NLP preprocessing pipeline and used Grey Wolf Optimizer (GWO) to tune embedding size, learning rate, and hidden units.",
      result:
        "Compared GWO-optimized configurations against baseline models to measure the accuracy gain from metaheuristic tuning.",
      stack: ["Python", "LSTM", "GWO", "NLP"],
      repoUrl: "https://github.com/Mano865/Spam-OR-Ham",
      liveUrl: null,
      coverImage: "/projects/sms-spam-detection.webp",
      imageTodo: "TODO: Replace decorative cover with real baseline vs. GWO chart when ready",
      metricsTodo: "TODO: Add exact baseline vs. optimized accuracy numbers",
      accentTone: "#9BB89E",
    },
    {
      slug: "audio-deepfake-detection",
      title: "Audio Deepfake Detection",
      year: "2025",
      problem:
        "Distinguishing authentic speech from synthetic (deepfake) audio requires robust acoustic feature extraction and awareness of ethical risks.",
      solution:
        "Designed an audio classification pipeline using short-time cepstral/LMDC-based feature extraction grounded in signal-processing fundamentals.",
      result:
        "Delivered a classification pipeline separating authentic from synthetic audio alongside an examination of ethical implications.",
      stack: ["Python", "Signal Processing", "Cepstral / LMDC", "Classification"],
      repoUrl: "https://github.com/Mano865/Audio-Deep-Fake-Detection",
      liveUrl: null,
      coverImage: "/projects/audio-deepfake-detection.webp",
      imageTodo: "TODO: Replace decorative cover with real spectrogram/pipeline diagram when ready",
      metricsTodo: "TODO: Add classification metrics and dataset details",
      accentTone: "#C7958A",
    },
    {
      slug: "sentiment-analysis-classical-ml",
      title: "Sentiment Analysis with Classical Machine Learning",
      year: "2024",
      problem:
        "Evaluating which classical machine learning algorithm performs best on text sentiment classification using statistical text features.",
      solution:
        "Engineered TF-IDF features and trained Logistic Regression, Naive Bayes, and SVM classifiers for text sentiment analysis.",
      result:
        "Benchmarked all three models using accuracy, precision, and recall.",
      stack: ["Python", "TF-IDF", "Logistic Regression", "Naive Bayes", "SVM"],
      // TODO: Add GitHub repository URL for this project (not listed in CV)
      repoUrl: null,
      liveUrl: null,
      coverImage: "/projects/sentiment-analysis.webp",
      imageTodo: "TODO: Replace decorative cover with real model comparison chart when ready",
      metricsTodo: "TODO: Add exact accuracy, precision, and recall scores",
      accentTone: "#B6A6CA",
    },
  ] satisfies Project[],

  experience: [
    {
      role: "Data Analytics & BI Track (Power BI & Tableau)",
      organization: "Information Technology Institute (ITI)",
      period: "Jul – Aug 2026",
      description:
        "Completed a 162-hour program covering SQL Server, advanced SQL, data warehousing, Microsoft SQLBI, statistics, Power BI, Tableau, and Excel. Also trained in Generative AI, AI agents, and workflow automation, and completed a capstone project.",
    },
    {
      role: "Machine Learning Track",
      organization: "DEPI (Digital Egypt Pioneers Initiative), Rowad Masr",
      period: "2025",
      description:
        "Studied core machine learning concepts and applied them with Microsoft Azure ML. Implemented regression and classification models on real datasets with train/test splitting, metric selection, and error analysis.",
    },
    {
      role: "Data Engineering Track",
      organization: "Information Technology Institute (ITI)",
      period: "2025",
      description:
        "Trained on building data pipelines, SQL querying, and data warehouse design principles.",
    },
    {
      role: "NLP Internship",
      organization: "National Telecommunication Institute (NTI)",
      period: "2025",
      description:
        "Applied hands-on NLP techniques including tokenization, sequence modeling, and deep learning workflows on text data.",
    },
    {
      role: "AI & Machine Learning Camp",
      organization: "Sprints x Microsoft Summer Camp",
      period: "2025",
      description:
        "Delivered practical AI/ML projects under mentorship as part of an intensive summer training program.",
    },
  ] satisfies ExperienceItem[],

  skills: [
    {
      category: "Programming Languages",
      items: ["Python", "Dart", "SQL", "C++", "C"],
    },
    {
      category: "Libraries & Frameworks",
      items: [
        "PyTorch",
        "TensorFlow",
        "Keras",
        "Flutter",
        "Pandas",
        "NumPy",
        "Matplotlib",
        "Seaborn",
        "Hugging Face Transformers",
      ],
    },
    {
      category: "Machine Learning & Computer Vision",
      items: [
        "Supervised Learning",
        "Deep Learning",
        "Computer Vision",
        "EfficientNet-B4 Fine-Tuning",
        "FAW Class Extension (39 Classes)",
        "Time-Series Forecasting",
        "Metaheuristic Optimization",
      ],
    },
    {
      category: "NLP",
      items: [
        "Text Classification",
        "Sentiment Analysis",
        "Tokenization",
        "Sequence Models",
        "Machine Translation",
      ],
    },
    {
      category: "Mobile & Web Development",
      items: [
        "Mobile App Development (Android & iOS)",
        "Flutter Web",
        "State Management & App Architecture",
        "REST APIs & Open-Meteo Integration",
        "Geolocation Services",
      ],
    },
    {
      category: "Backend, Cloud & Security",
      items: [
        "Firebase Auth",
        "Google Sign-In",
        "Supabase Storage",
        "Security Auditing & Fixes",
      ],
    },
    {
      category: "Tools & Platforms",
      items: ["Google Colab", "Jupyter", "Git / GitHub", "Microsoft Azure ML"],
    },
    {
      category: "Languages",
      items: ["Arabic (Native)", "English (Upper Intermediate — B2)"],
    },
  ] satisfies SkillGroup[],

  education: [
    {
      institution: "New Ismailia National University (NINU)",
      degree: "B.Sc. in AI Engineering",
      faculty: "Faculty of Engineering, Ismailia, Egypt",
      expectedGraduation: "Expected 2027",
      gpa: "GPA: 3.09 / 4 (Very Good)",
    },
  ] satisfies EducationItem[],
} as const;
