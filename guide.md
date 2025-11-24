// -------------zustand------------
// const user = userStore((state) => state.user);
// const setUser = userStore((state) => state.setUser);
// const updateUser = userStore((state) => state.updateUser);
// const clearUser = userStore((state) => state.clearUser);

// add to the store 
// <button onClick={() => setUser(users[0])}>Set User</button>
// remove from the store 
// <button onClick={() => clearUser()}>Clear User</button>
// show the user 
// <p>{user?.email}</p>


// -----------------select------------- 
// <Select
// items={users}
// valueKey="id" // Returns the 'id' property
// labelKey="name" // Displays the 'name' property
// imageKey="avatar" // Shows image if property exists
// onSelect={(id) => console.log("Selected ID:", id)}
// placeholder="Select User"
// /> 

//---------------- formik ----------------
 const validationSchema = Yup.object().shape({
   email: Yup.string().when("loginVia", {
     is: "email",
     then: (schema) =>
       schema.required("email is required").email("plaser enter a valid email"),
     otherwise: (schema) => schema.notRequired(),
   }),
   phone: Yup.string().when("loginVia", {
     is: "phone",
     then: (schema) =>
       schema
         .required("Phone number is required")
         .matches(/^\+?[0-9\s-]{6,}$/, "Invalid Phone number"),
     otherwise: (schema) => schema.notRequired(),
   }),
   password: Yup.string()
     .required("password is required")
     .min(10, "Password must be at least 10 characters"),
 });

    const formik = useFormik({
    initialValues: {
    name: "",
    email: "",
    password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setErrMsg("");
      try {
        const response = await handleLogin(values, loginVia);
        if (response?.status === 200) {
          router.replace("/");
        }
      } catch (error) {
        console.log(error);
        setErrMsg(error?.response?.data?.message);
        await handleApiErr(error);
      }
    },
  });
