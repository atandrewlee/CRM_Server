export const nocoAPIGetAll = {
  data: {
    list: [
      {
        Id: 101,
        Name: "Barack Obama",
        URL: null,
        Linkedin: null,
        Email: null,
        Phone: null,
        Last_Contact: "2024-08-12",
        Company: 0,
        Tags: null,
        Birthday: null,
        relationship: null,
        Instagram: null,
        Twitter: null,
        Location: null,
        Connections: 0,
        interests: null,
        Next_Contact: null,
        Tier: null,
        Next_Contact_Interval: 30,
        "Company-Title": [],
      },
    ],
    pageInfo: {
      totalRows: 1,
      page: 1,
      pageSize: 25,
      isFirstPage: true,
      isLastPage: true,
    },
  },
  // Other Fields in A Response
};

export const nocoAPIGetSpecificColumns = {
  data: {
    list: [
      {
        Id: 101,
        Name: "Barack Obama",
        Last_Contact: "2024-08-12",
      },
    ],
    pageInfo: {
      totalRows: 1,
      page: 1,
      pageSize: 25,
      isFirstPage: true,
      isLastPage: true,
    },
  },
  // Other Fields in A Response
};

// Response when wrong input is given
export const nocoAPIGetSpecificColumnsError = {
  data: { error: "FIELD_NOT_FOUND", message: "Field 'Hello' not found" },
  // Other Fields In Response
};

export const nocoAPIChangeLastContactNextContact = { Id: 101 }