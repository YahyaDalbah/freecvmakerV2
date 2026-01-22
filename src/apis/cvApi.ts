import type { PersonalInfo, Experience, Education, Skill, Project, Reference } from './types';

const API_BASE_URL = 'http://localhost:3001/api';

export interface CvData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  references: Reference[];
}

// Get token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Get user's CV data
export const getCvData = async (): Promise<CvData> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found. Please login.');
  }

  const response = await fetch(`${API_BASE_URL}/cv`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error || 'Failed to fetch CV data');
  }

  const data = await response.json();
  return data.cvData;
};

// Update user's CV data
export const updateCvData = async (cvData: CvData): Promise<CvData> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found. Please login.');
  }

  const response = await fetch(`${API_BASE_URL}/cv`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cvData })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || 'Failed to update CV data');
  }

  const data = await response.json();
  return data.cvData;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

