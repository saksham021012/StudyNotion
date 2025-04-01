![image](https://github.com/user-attachments/assets/c0ffc202-021a-4821-bde7-154f4d6c5bb0)
# StudyNotion - Ed-Tech Platform

## Project Description

StudyNotion is a fully functional ed-tech platform that enables users to create, consume, and rate educational content. The platform is built using the MERN stack, which includes ReactJS, NodeJS, MongoDB, and ExpressJS. StudyNotion aims to provide:

- A seamless and interactive learning experience for students, making education more accessible and engaging.
- A platform for instructors to showcase their expertise and connect with learners across the globe.

## System Architecture

StudyNotion consists of three main components: the front end, the back end, and the database. The platform follows a client-server architecture, where:

- **Front-end**: The client side, built using ReactJS.
- **Back-end**: Server side, built using NodeJS and ExpressJS.
- **Database**: MongoDB as the NoSQL database.

### Architecture Diagram
*Here is a high-level diagram illustrating the architecture of StudyNotion.*  
![image](https://github.com/user-attachments/assets/cc37a121-9049-4c6a-9a91-20b1926f9f37)

## Front-end

The front end of StudyNotion is built using ReactJS, which is a popular JavaScript library for building dynamic and responsive user interfaces. The front end communicates with the back end using RESTful API calls.

The UI is designed using **Figma** for a clean and minimal look. The front-end features include:

### Pages for Students:
- **Homepage**: Introduction and links to course list and user details.
- **Course List**: Display of all available courses with descriptions and ratings.
- **Wishlist**: Display of added courses.
- **Cart Checkout**: Allows users to complete course purchases.
- **Course Content**: Displays course content, videos, and materials.
- **User Details**: Displays student’s account details.
- **User Edit Details**: Allows editing of account information.

### Pages for Instructors:
- **Dashboard**: Overview of courses and feedback.
- **Insights**: Detailed analytics on courses.
- **Course Management**: Create, update, and delete courses.
- **Profile Details**: View and edit account details.

### Tools and Libraries:
- **ReactJS**, **CSS**, **TailwindCSS**: For UI development.
- **Redux**: For state management.
- **VSCode**: Code editor.

## Back-end

The back end is built using **Node.js** and **Express.js**, forming the backbone of the platform with the following features:

### Back-end Features:
- **User Authentication**: Email login, OTP verification, and password recovery.
- **Course Management**: Instructors can create, read, update, and delete courses.
- **Payment Integration**: Razorpay for processing payments during checkout.
- **Cloud Media Storage**: Cloudinary for managing course media like images and videos.
- **Markdown Support**: For formatting course content.

### Frameworks and Libraries Used:
- **Node.js** and **Express.js**: Server-side framework and runtime.
- **MongoDB**: NoSQL database for flexible data storage.
- **JWT**: Authentication via JSON Web Tokens.
- **Bcrypt**: For hashing passwords.
- **Mongoose**: ODM for interacting with MongoDB.

### Data Models:
- **Student**: Includes student details such as name, email, and enrolled courses.
- **Instructor**: Includes instructor details and course information.
- **Course**: Contains course metadata such as name, description, instructor details, and media.
  ![image](https://github.com/user-attachments/assets/599626f9-a39f-4e34-8b76-3c3bbe0f3f98)

## API Design

The API is RESTful, using **Node.js** and **Express.js** to communicate with the front end. It supports various HTTP methods (GET, POST, PUT, DELETE).

## Conclusion

StudyNotion is a robust, scalable, and interactive ed-tech platform designed for a rich learning experience for students and a comprehensive teaching platform for instructors. The architecture and technologies used provide a solid foundation for growth, security, and future enhancements.
