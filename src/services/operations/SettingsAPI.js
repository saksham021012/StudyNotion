import { toast } from "react-hot-toast"

import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { settingsEndpoints } from "../apis"
import { logout } from "./authAPI"

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints

//updateProfilePicture
export async function updatePfp(token,pfp){
  const toastId = toast.loading("Uploading...");
  try {
    const formData = new FormData();
    console.log("pfp",pfp)
    formData.append('pfp',pfp);
    const response = await apiConnector("PUT", settingsEndpoints.UPDATE_DISPLAY_PICTURE_API,formData,{
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    });
    console.log("UPDATE_DISPLAY_PICTURE_API API RESPONSE............", response)
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Profile Picture Updated Successfully");
    window.location.reload();
    const imageUrl = response.data.data.image;
    localStorage.setItem("user",JSON.stringify({...JSON.parse(localStorage.getItem("user")),image:imageUrl}));
    console.log(JSON.parse(localStorage.getItem("user")).image);
  } catch (error) {
    console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
}


export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      })
      console.log("UPDATE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.updatedUserDetails.image
        ? response.data.updatedUserDetails.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
      dispatch(
        setUser({ ...response.data.updatedUserDetails, image: userImage })
      )
      toast.success("Profile Updated Successfully")
      
    } catch (error) {
      console.log("UPDATE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Update Profile")
    }
    toast.dismiss(toastId)
  }
}

export async function changePassword(token, formData) {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CHANGE_PASSWORD_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Password Changed Successfully")
  } catch (error) {
    console.log("CHANGE_PASSWORD_API API ERROR............", error)
    toast.error(error.response.data.message)
  }
  toast.dismiss(toastId)
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("DELETE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Profile Deleted Successfully")
      dispatch(logout(navigate))
    } catch (error) {
      console.log("DELETE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Delete Profile")
    }
    toast.dismiss(toastId)
  }
}

export async function updateAdditionalDetails(token, additionalDetails) {
  console.log("additionalDetails", additionalDetails);
  const { firstName, lastName, dateOfBirth, gender, contactNumber, about } = additionalDetails;

  const user = JSON.parse(localStorage.getItem("user"));
  const updatedData = {};

  // Create an object with only the updated fields
  if (firstName && firstName !== user.firstName) updatedData.firstName = firstName;
  if (lastName && lastName !== user.lastName) updatedData.lastName = lastName;
  if (dateOfBirth && dateOfBirth !== user.additionalDetails.dateOfBirth) updatedData.dateOfBirth = dateOfBirth;
  if (contactNumber && contactNumber !== user.additionalDetails.contactNumber) updatedData.contactNumber = contactNumber;
  if (about && about !== user.additionalDetails.about) updatedData.about = about;
  if (gender && gender !== user.additionalDetails.gender) updatedData.gender = gender;

  // If no fields have changed, exit early
  if (Object.keys(updatedData).length === 0) {
    toast.info("No changes detected.");
    return;
  }

  console.log("Updated fields to be sent:", updatedData);

  const toastId = toast.loading("Updating...");
  try {
    const response = await apiConnector(
      "PUT",
      settingsEndpoints.UPDATE_PROFILE_API,
      updatedData, 
      { Authorization: `Bearer ${token}` }
    );
    console.log("UPDATE_ADDITIONAL_DETAILS_API API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Additional Details Updated Successfully");

    // Update the local storage with the new user data
    user.firstName = updatedData.firstName || user.firstName;
    user.lastName = updatedData.lastName || user.lastName;
    user.additionalDetails.dateOfBirth = updatedData.dateOfBirth || user.additionalDetails.dateOfBirth;
    user.additionalDetails.contactNumber = updatedData.contactNumber || user.additionalDetails.contactNumber;
    user.additionalDetails.about = updatedData.about || user.additionalDetails.about;
    user.additionalDetails.gender = updatedData.gender || user.additionalDetails.gender;

    localStorage.setItem("user", JSON.stringify(user));
    window.location.reload();

  } catch (error) {
    console.log("UPDATE_ADDITIONAL_DETAILS_API API ERROR............", error);
    toast.error(error.response?.data?.message || "An error occurred while updating.");
  }
  toast.dismiss(toastId);
}
