Here's a detailed project specification document for your G1 Test Preparation Application:

# G1 Test Preparation Application - Project Specification

## 1. Project Overview
A web-based application designed to help users prepare for Ontario's G1 driving test, featuring practice quizzes, comprehensive question reviews, and performance analytics.

## 2. Technical Stack
### Frontend:
- React (Vite)
- React Router for navigation
- Tailwind CSS for styling
- DaisyUI for UI components
- State management with React Context/Redux

### Backend:
- Flask Python framework
- SQLite database
- JWT for authentication

## 3. Database Schema

### Users Table:
```
- user_id (PRIMARY KEY)
- username (UNIQUE)
- password_hash
- is_admin (BOOLEAN)
- created_at
```

### Questions Table:
```
- question_id (PRIMARY KEY)
- category (signs/rules)
- question_text
- image_path (NULL for rules questions)
- options (JSON)
- correct_answer
```

### Attempts Table:
```
- attempt_id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- question_id (FOREIGN KEY)
- is_correct (BOOLEAN)
- timestamp
```

### Quiz Sessions Table:
```
- session_id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- start_time
- end_time
- score
- questions (JSON)
```

## 4. Core Features

### 4.1 Authentication System
- Simple login page
- JWT-based session management
- Admin management script (admin_management.py) features:
  - User CRUD operations
  - JSON to database import
  - Database maintenance utilities

### 4.2 Quiz System
- Random quiz generation:
  - 40 questions total
  - 20 traffic signs questions
  - 20 rules of the road questions
- Progress tracking
- Timer (optional)
- Immediate feedback on submission
- Results summary

### 4.3 Question Review System
- Comprehensive question browser
- Card-based layout
- Image display for traffic signs
- Filter by category
- Search functionality
- Correct answer highlighting

### 4.4 Statistics Dashboard
- Question performance metrics
- Sortable table view
- Filters for question types
- Statistics including:
  - Total attempts
  - Success rate
  - Most challenging questions
  - User performance trends

## 5. API Endpoints

### Authentication:
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/verify

### Quiz:
- POST /api/quiz/generate
- POST /api/quiz/submit
- GET /api/quiz/history

### Questions:
- GET /api/questions
- GET /api/questions/{id}
- GET /api/questions/statistics

### Admin:
- POST /api/admin/users
- DELETE /api/admin/users/{id}
- PUT /api/admin/questions
- GET /api/admin/statistics

## 6. User Interface Flow

### 6.1 Login Page
- Simple login form
- Error messaging
- Redirect to dashboard on success

### 6.2 Main Dashboard
- prominent "Start Quiz" button
- Quick statistics overview
- Navigation to other sections

### 6.3 Quiz Interface
- Question display with image (if applicable)
- Multiple choice options
- Progress indicator
- Submit button
- Results summary

### 6.4 Question Browser
- Grid/List view toggle
- Category filters
- Search bar
- Interactive cards with question details

### 6.5 Statistics Page
- Sortable data table
- Filter controls
- Performance metrics
- Export functionality (optional)

## 7. Data Security
- Password hashing
- JWT token encryption

## 8. Future Enhancements (Optional)


## 9. Deployment Considerations


# G1 Test Preparation Application - User Walkthrough

## 1. Initial Access
Users arrive at the homepage and are immediately redirected to the login page if not authenticated.

## 2. Login Process
- Simple login page with username/password fields
- No registration option (admin creates accounts)
- Successful login redirects to main dashboard
- Failed login shows error message

## 3. Main Dashboard
### Layout:
- Clean, minimalist design
- Header with navigation links: Home, All Questions, Statistics, Logout
- Large centered "Start New Quiz" button
- Previous attempts summary (if any)

## 4. Quiz Flow
### Starting a Quiz:
1. User clicks "Start New Quiz"
2. System generates random 40 questions (20 signs, 20 rules)
3. Quiz interface loads

### During Quiz:
- One question displayed at a time
- For sign questions: image displayed prominently above options
- Multiple choice options presented as clickable cards
- Progress indicator (e.g., "Question 15/40")
- Navigation buttons: Previous/Next
- Option to review flagged questions
- Timer (optional feature)

### Completing Quiz:
- Submit button appears on last question
- Confirmation dialog before submission
- Results page shows:
  - Overall score
  - Number of correct/incorrect answers
  - Option to review incorrect answers
  - Return to dashboard button

## 5. All Questions Browser
### Layout:
- Grid view of question cards
- Category filter tabs: "All", "Signs", "Rules"
- Search bar for filtering questions

### Question Cards:
- For sign questions:
  - Traffic sign image
  - Question number
  - Preview of question text
- For rules questions:
  - Question text
  - Category indicator

### Card Interaction:
- Click expands card to show:
  - Full question
  - All options
  - Correct answer highlighted
  - Statistics for this question (attempts/success rate)

## 6. Statistics Page
### Layout:
- Table view with columns:
  - Question ID/Image
  - Question text
  - Total attempts
  - Correct attempts
  - Success rate
  - Last attempted

### Features:
- Sortable columns
- Filter by category
- Search functionality
- Export data option (optional)
- Performance graphs/charts (optional)

## 7. Navigation Experience
- Smooth transitions between pages
- Consistent header across all pages
- Breadcrumb navigation
- Mobile-responsive design
- Loading states for data fetching

## 8. Error Handling
- Clear error messages
- Auto-save during quiz

## 9. Accessibility Features
