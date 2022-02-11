// import { useEffect, useState } from "react";
// import { firebase, firebaseAuth } from "../firebase";
// import { StyledFirebaseAuth } from "react-firebaseui";
// import { onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";

// const uiConfig = {
//   signInFlow: "popup",
//   signInOptions: [new GoogleAuthProvider().PROVIDER_ID],
//   callbacks: {
//     signInSuccessWithAuthResult: () => false,
//   },
// };

// function SignIn() {
//   const [isSignedIn, setIsSignedIn] = useState(false);

//   useEffect(() => {
//     const unregisterAuthObserver = onAuthStateChanged(firebaseAuth, (user) => {
//       setIsSignedIn(!!user);
//     });
//     return () => unregisterAuthObserver();
//   }, []);

//   if (!isSignedIn) {
//     return (
//       <div>
//         <h1>Web Journal</h1>
//         <p>Please Sign-in</p>
//         <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth} />
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1>Web Journal</h1>
//       <p>Welcome {firebaseAuth.currentUser.displayName}!</p>
//       <a onClick={() => firebaseAuth.signOut()}>Sign-Out</a>
//     </div>
//   );
// }

// export default SignIn;
