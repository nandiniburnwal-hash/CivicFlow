import { Issue, User } from './types';

export const CIVIC_CATEGORIES = [
  'Roads & Potholes',
  'Sanitation & Waste',
  'Water Supply & Leakage',
  'Streetlights & Power',
  'Public Parks & Greenery',
  'Traffic & Signage',
  'Storm Drainage & Flooding',
  'Other',
] as const;

export const CATEGORIES = [
  { id: 'roads', label: 'Roads & Potholes' },
  { id: 'sanitation', label: 'Sanitation & Waste' },
  { id: 'water', label: 'Water Supply & Leakage' },
  { id: 'lighting', label: 'Streetlights & Power' },
  { id: 'parks', label: 'Public Parks & Greenery' },
  { id: 'traffic', label: 'Traffic & Signage' },
  { id: 'drainage', label: 'Storm Drainage & Flooding' },
  { id: 'other', label: 'Other Civic Hazard' },
] as const;

// Sample demonstration user for local preview
export const DEMO_CITIZEN: User = {
  id: 'usr_c01',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  role: 'CITIZEN',
};

// Sample demonstration issues for UI preview before backend database connection
export const INITIAL_ISSUES: Issue[] = [
  {
    id: 'iss-101',
    title: 'Pothole cluster on Main Boulevard near 4th Avenue',
    description: 'Multiple deep potholes spanning two lanes, creating road hazards for vehicles and cyclists.',
    category: 'Roads & Potholes',
    location: 'Main Boulevard & 4th Avenue',
    status: 'IN_PROGRESS',
    createdAt: '2026-10-14T09:30:00Z',
    updatedAt: '2026-10-15T11:15:00Z',
    userId: 'usr_c01',
    user: {
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      role: 'CITIZEN',
    },
  },
  {
    id: 'iss-102',
    title: 'Water mainline leakage on Pine Street sidewalk',
    description: 'Water leaking continuously onto the pedestrian footpath, causing puddling and erosion.',
    category: 'Water Supply & Leakage',
    location: '142 Pine Street, North Walkway',
    status: 'ASSIGNED',
    createdAt: '2026-10-14T07:15:00Z',
    updatedAt: '2026-10-14T14:40:00Z',
    userId: 'usr_c02',
    user: {
      name: 'Elena Rostova',
      email: 'elena.r@example.com',
      role: 'CITIZEN',
    },
  },
  {
    id: 'iss-103',
    title: 'Overflowing community collection bins at Market Square',
    description: 'Waste container has exceeded capacity and debris is spilling onto the adjacent curb.',
    category: 'Sanitation & Waste',
    location: 'Market Square South Entrance',
    status: 'REPORTED',
    createdAt: '2026-10-15T08:20:00Z',
    updatedAt: '2026-10-15T08:20:00Z',
    userId: 'usr_c01',
    user: {
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      role: 'CITIZEN',
    },
  },
  {
    id: 'iss-104',
    title: 'Non-functional street lighting along Oak Lane',
    description: 'Three consecutive streetlights are dark after sunset, reducing visibility for pedestrians.',
    category: 'Streetlights & Power',
    location: 'Oak Lane (Bays 12-16)',
    status: 'RESOLVED',
    createdAt: '2026-10-10T19:45:00Z',
    updatedAt: '2026-10-13T16:10:00Z',
    userId: 'usr_c01',
    user: {
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      role: 'CITIZEN',
    },
  },
  {
    id: 'iss-105',
    title: 'Damaged storm drainage grate near school crossing',
    description: 'Iron drainage grate is cracked and slightly displaced. Needs repositioning and welding.',
    category: 'Storm Drainage & Flooding',
    location: 'Elm Street, School Crossing Ramp',
    status: 'IN_PROGRESS',
    createdAt: '2026-10-13T14:10:00Z',
    updatedAt: '2026-10-14T18:00:00Z',
    userId: 'usr_c03',
    user: {
      name: 'Devon Patel',
      email: 'dpatel@example.com',
      role: 'CITIZEN',
    },
  },
  {
    id: 'iss-106',
    title: 'Faded pedestrian crosswalk markings on 8th Street',
    description: 'Zebra crossing paint has largely worn away, decreasing motorist awareness of foot traffic.',
    category: 'Traffic & Signage',
    location: '8th Street & Cedar Ave Intersection',
    status: 'REPORTED',
    createdAt: '2026-10-15T11:00:00Z',
    updatedAt: '2026-10-15T11:00:00Z',
    userId: 'usr_c04',
    user: {
      name: 'Maya Lin',
      email: 'mlin@example.com',
      role: 'CITIZEN',
    },
  },
];

