import axios from "axios";

import * as Config from "../../../Utils/config";


export async function GetAllThemesApi() {
  try {
    const response = await axios.get(`${Config.base_url}themes`);
    
    return response.data; 
  } catch (error) {
    console.log("Error fetching themes:", error.message || error);  
    throw error;  
  }
}

export async function GetAllThemesNameApi() {
  try {
    const response = await axios.get(`${Config.base_url}themes/names`);
    
    return response.data; 
  } catch (error) {
    console.log("Error fetching themes:", error.message || error);  
    throw error;  
  }
}

export async function GetThemeByIdApi(id) {
  try {
    const response = await axios.get(`${Config.base_url}themes/${id}`);
    
    return response.data; 
  } catch (error) {
    console.log("Error fetching theme:", error.message || error);  
    throw error;  
  }
}

export async function AddThemeApi(data) {
  try {
    const response = await axios.post(`${Config.base_url}themes`, data);
    
    return response.data; 
  } catch (error) {
    console.log("Error adding theme:", error.message || error);  
    throw error;  
  }
}

export async function UpdateThemeApi(id, data) {
  try {
    const response = await axios.put(`${Config.base_url}themes/${id}`, data);
    
    return response.data; 
  } catch (error) {
    console.log("Error updating theme:", error.message || error);  
    throw error;  
  }
}

export async function DeleteThemeApi(id) {
  try {
    const response = await axios.delete(`${Config.base_url}themes/${id}`);
    
    return response.data; 
  } catch (error) {
    console.log("Error deleting theme:", error.message || error);  
    throw error;  
  }
}