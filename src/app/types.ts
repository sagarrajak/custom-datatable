export interface IEmployee {
  id: string;
  jobTitleName: string;
  firstName: string;
  lastName: string;
  preferredFullName: string;
  employeeCode: string;
  region: string;
  dob: string;
  phoneNumber: string;
  emailAddress: string;
};

export interface IHeaders {
  id: string;
  job_title: string;
  full_name: string;
  phone_number: string;
  email: string;
  region: string;
  dob: string;
}
