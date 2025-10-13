# 🗺️ Feature/User Flowchart

## Micro-level: Seamless User Journey from Sign-in to Streaming

This document visualizes the **step-by-step flow** of a typical user journey in the Dex-Real-Time-Streaming platform.  
It represents how users interact with the product from landing, authentication, profile selection, movie browsing, and playback to account management mirroring the real experience and helping developers/designers optimize for each interaction.

---

### 🔄 User Interaction Flow

```mermaid
graph TD
    A[User Visits Site /] --> B{Authenticated?}
    B -->|No| C[Landing Page /]
    B -->|Yes| D[Browse Page /browse]

    C --> E[Click Sign In or Get Started]
    E --> F[Auth Page /auth]

    F --> G{Login or Register?}
    G -->|Login| H[Submit Credentials]
    G -->|Register| I[Create Account]
    G -->|OAuth| J[GitHub/Google OAuth]

    H --> K{Auth Success?}
    I --> K
    J --> K

    K -->|No| L[Show Error]
    L --> F
    K -->|Yes| M[Profile Selection /profiles]

    M --> N[Click Profile]
    N --> D

    D --> O[Billboard Featured Content]
    D --> P[Movie Lists]

    P --> Q{User Action?}
    Q -->|Click Info Icon| R[Open Movie Modal]
    Q -->|Click Play Button| S[Video Player /watch/movieId]
    Q -->|Click Favorite| T[Toggle Favorite]

    R --> U{Modal Action?}
    U -->|Play| S
    U -->|Add to Favorites| T
    U -->|Close| D

    T --> D
    S --> V[Back Arrow]
    V --> D

    D --> W[Account Menu]
    W --> X{Menu Action?}
    X -->|Logout| Y[Sign Out]
    X -->|View Profile| M

    Y --> A

    style A fill:#e1f5fe
    style D fill:#c8e6c9
    style F fill:#fff9c4
    style S fill:#f8bbd0
    style R fill:#e1bee7
```

---

### 📝 Flow Steps (Text Summary)

- **User Visits Site** (`/`)
- -> **Landing Page** (if not authenticated)
  - -> **Sign In / Register** (`/auth`)
    - If authentication **fails**, show error
    - If successful, continue:
- -> **Profile Selection** (`/profiles`)
- -> **Browse / Discovery** (`/browse`)
  - **Billboard** (Featured content with video preview)
  - **Movie Lists** (Trending Now, My List)
    - Clicking info icon opens **Movie Modal** (InfoModal component)
      - View details
      - Add to Favorites (toggle)
      - Play Movie
    - **Play Movie** ➡️ **Video Player** (`/watch/[movieId]`)
  - **Account Menu** (Navbar dropdown)
    - View Profile
    - **Logout**

---

## 💡 Why This Flowchart?

This flowchart gives the team and newcomers an “at-a-glance” reference of how a user travels through the app. It supports planning for UI/UX, testing, features, and onboarding documentation.

For high-level system architecture, please refer to [architecture.md](./architecture.md).
