export interface TaskItem {
  id: number;
  title: string;
  assignee: string;
  status: 'Planning' | 'In Progress' | 'Blocked' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  effort: number;
}

export interface ResourceItem {
  id: number;
  name: string;
  role: string;
  skill: string;
  availability: number;
  location: string;
}

export interface ResourceOption {
  id: number;
  name: string;
  role: string;
}

export interface ProjectOption {
  id: number;
  name: string;
  code: string;
}

export interface ResourceAllocation {
  id: number;
  userName: string;
  projectName: string;
  allocationPercent: number;
  utilizationPercent: number;
  status: 'Healthy' | 'Overallocated';
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Project Manager' | 'Team Member';
  department: 'Engineering' | 'Design' | 'Product' | 'Finance' | 'Operations';
  status: 'Active' | 'Inactive' | 'On Leave';
  joinDate?: string;
}

export interface Project {
  id: number;
  name: string;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  manager: string;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  budget: number;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  assignedUser: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Done' | 'Blocked';
}
