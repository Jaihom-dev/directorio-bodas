import { api } from "../api";

const types = {
  json: "",
  formData: "",
};

interface fetchApiProps {
  query: string;
  variables: object;
  type: keyof typeof types;
  token?: string;
}
export const fetchApi: CallableFunction = async ({
  query = ``,
  variables = {},
  type = "json",
  token,
}: fetchApiProps): Promise<any> => {
  try {
    if (type === "json") {
      const {
        data: { data },
      } = await api.graphql({ query, variables }, token);
      return Object.values(data)[0];
    } else if (type === "formData") {
      const formData = new FormData();
      const values = Object?.entries(variables);

      // Generar el map del Form Data para las imagenes
      const map = values?.reduce((acc: any, item: any) => {
        if (item[1] instanceof File) {
          acc[item[0]] = [`variables.${item[0]}`];
        }
        if (item[1] instanceof Object) {
          Object.entries(item[1]).forEach((el) => {
            if (el[1] instanceof File) {
              acc[el[0]] = [`variables.${item[0]}.${el[0]}`];
            }
            if (el[1] instanceof Object) {
              Object.entries(el[1]).forEach((elemento) => {
                if (elemento[1] instanceof File) {
                  acc[elemento[0]] = [
                    `variables.${item[0]}.${el[0]}.${elemento[0]}`,
                  ];
                }
              });
            }
          });
        }
        return acc;
      }, {});

      // Agregar filas al FORM DATA

      formData.append("operations", JSON.stringify({ query, variables }));
      formData.append("map", JSON.stringify(map));
      values.forEach((item) => {
        if (item[1] instanceof File) {
          formData.append(item[0], item[1]);
        }
        if (item[1] instanceof Object) {
          Object.entries(item[1]).forEach((el) => {
            if (el[1] instanceof File) {
              formData.append(el[0], el[1]);
            }
            if (el[1] instanceof Object) {
              Object.entries(el[1]).forEach((elemento) => {
                if (elemento[1] instanceof File) {
                  formData.append(elemento[0], elemento[1]);
                }
              });
            }
          });
        }
      });

      const { data } = await api.graphql(formData, token);

      if (data.errors) {
        throw new Error(JSON.stringify(data.errors));
      }

      return Object.values(data.data)[0];
    }
  } catch (error) {
    console.log(error);
  }
};

type queries = {
  createUser: string;
  createBusiness: string;
  createReviews: string;
  updateReview: string;
  getAllPost: string;
  getAllCategoryBusiness: string;
  getAllBusiness: string;
  getAllReviews: string;
  getChats: string;
  getOneChat: string;
  getOneCategoryPost: string;
  getHome: string;
  getCategories: string;
  getUser: string;
  getSlugBusiness: string;
  getOneBusiness: string;
  getAverageBusiness: string;
  getChatIdForBusiness: string;
  getSlugPosts: string;
  getMagazine: string;
  deleteImages: string;
  deleteBusiness: string;
  deleteReview: string;
  getOnePost: string;
  getAllPage: string;
  getOnePage: string;
  getAllCategoryPost: string;
  getSubcategoriesPost: string;
  getOneSubcategoryPost: string;
  getOneSubcategoryBusiness: string;
  auth: string
  authStatus: string
  signOut: string
  singleUpload: string;
};

export const queries: queries = {
  signOut: `mutation ($sessionCookie :String){
    signOut(sessionCookie:$sessionCookie)
  }`,
  auth: `mutation ($idToken : String){
    auth(idToken: $idToken){
      sessionCookie
    }
  }`,
  authStatus: `mutation ($sessionCookie : String){
    status(sessionCookie: $sessionCookie){
      customToken
    }
  }`,
  getOneSubcategoryBusiness: `query ($slug: String){
    getOneSubCategoryBusiness(slug: $slug){
      _id
      slug
      title
      heading
      description
      imgMiniatura{
        _id
        i1024
        i800
        i640
        i320
      }
      imgBanner{
        _id
        i1024
        i800
        i640
        i320
      }
      icon{
        _id
        i1024
        i800
        i640
        i320
      }
      characteristics{
        _id
        title
        items{
          _id
          title
        }
      }
      questions{
        _id
        title
      }
    }
  }`,
  getOneSubcategoryPost: `query ($id : ID, $slug : String){
    getOneSubCategoryPost(_id: $id, slug:$slug){
      _id
      title
      heading
      slug
      description
      imgMiniatura{
        _id
        i1024
        i800
        i640
        i320
      }
      imgBanner{
        _id
        i1024
        i800
        i640
        i320
      }
      icon{
        _id
        i1024
        i800
        i640
        i320
      }
    }
  }`,
  getSubcategoriesPost: `query {
    getSubCategoryPost{
      total
      results{
        _id
        title
        slug
      }
    }
  }`,
  getAllCategoryPost: `query {
    getCategoryPost{
      total
      results{
        _id
        title
        slug
        subCategories{
          _id
          title
          slug
        }
        icon{
          _id
          i1024
          i800
          i640
          i320
        }
      }
    }
  }`,
  singleUpload:`mutation($file:Upload!,$use:String)
  {
    singleUpload(file:$file,use:$use){
      _id
      i640
    }
  }`,
  getOneCategoryPost: `query ($slug:String) {
    getOneCategoryPost(slug:$slug){
      _id
      title
      heading
      slug
      description
      imgMiniatura{
        _id
        i1024
        i800
        i640
        i320
      }
      imgBanner{
        _id
        i1024
        i800
        i640
        i320
      }
      icon{
        _id
        i1024
        i800
        i640
        i320
      }
      subCategories{
        _id
        title
        heading
        slug
        description
        imgMiniatura{
        _id
        i1024
        i800
        i640
        i320
      }
      imgBanner{
        _id
        i1024
        i800
        i640
        i320
      }
      icon{
        _id
        i1024
        i800
        i640
        i320
      }
      }
      
    }
  }`,
  getOnePost: `query ($id:ID, $slug:String ) {
    getOnePost(_id:$id, slug:$slug){
    title
    subTitle
    content
    permaLink
    slug
    seoDescription
    categories{
      _id
      title
    }
    subCategories{
      _id
      title
    }
    tags
    imgCarrusel{
      _id
      i1024
      i800
      i640
      i320
    }
    imgMiniatura{
      _id
      i1024
      i800
      i640
      i320
    }
    imgTexto{
      _id
      i1024
      i800
      i640
      i320
    }
    authorUsername
    status
    createdAt
    updatedAt
    }
    }`,
  getAllPage: `query ( $sort:sortCriteriaPage, $skip: Int, $limit: Int ) {
    getAllPage( sort:$sort,skip:$skip, limit:$limit){
    total
    results{
      _id
      title
      content
      slug
      imgTexto{
        _id
        i1024
        i800
        i640
        i320
      }
      authorUsername
      status
      createdAt
      updatedAt
    	}
    }
  }`,
  getOnePage: `query($id:ID, $slug:String){
    getOnePage(_id:$id, slug:$slug){
      _id
      title
      content
      slug
      imgTexto{
        _id
        i1024
        i800
        i640
        i320
      }
      authorUsername
      status
      views
      createdAt
      updatedAt
    }
  }`,
  getOneChat: `query($IDChat :ID){
    getOneChat(_id: $IDChat){
      _id
      title
      onLine{
        status
        dateConection
      }
      type
      photoURL
      addedes{
        userUid
        type
      }
      messages{
        type
        emitUserUid
        message
        fileUrl
        createdAt
        received
        read
        deletedEmit
        deletedReceiv
      }
      createdAt
      updatedAt
    }
  }`,
  getChatIdForBusiness: `query ($businessID : ID){
    getChatIdForBusiness(_id: $businessID)
  }`,
  getChats: `query ($uid: [ID], $skip :Int!, $limit : Int!, $text : String) {
    getChats(uid :$uid, skip: $skip, limit: $limit, include: $text){
      total
      results{
        _id
        title
        onLine{
          status
          dateConection
        }
        type
        addedes{
          userUid
          type
        }
        messages{
          type
          emitUserUid
          message
          fileUrl
          createdAt
          received
          read
          deletedEmit
          deletedReceiv
        }
        createdAt
        updatedAt
        photoURL
      }
    }
  }`,
  getAverageBusiness: `query ($id: ID, $slug : String) {
    getOneBusiness(_id: $id, slug: $slug){
      _id
      review
    	reviewsT {
        total
        professionalism
        recommended
        priceQuality
        flexibility
      }
    }
  }`,
  deleteReview: `mutation ($id : [ID]){
    deleteReview(_id: $id)
  }`,
  updateReview: `mutation ($id : ID, $args:inputReview){
    updateReview(_id: $id, args:$args){
      _id
      business{
        _id
      }
      user {
        _id
      }
      average
      professionalism
      recommended
      priceQuality
      flexibility
      comment
    }
  }`,
  getAllReviews: `query ($criteria :searchCriteriaReview, $sort: sortCriteriaReview, $skip: Int, $limit :Int) {
    getAllReview(searchCriteria: $criteria, sort: $sort, skip: $skip, limit: $limit){
      total
      results{
       _id
      business{
        _id
      }
      user{
        _id
        photoURL
        displayName
      }
      average
      reference
      professionalism
      recommended
      priceQuality
      flexibility
      comment
      createdAt
      answer
      imgCarrusel{
        _id
        i1024
        i800
        i640
        i320
      }
      
      }
    }
  }`,
  createUser: `mutation  ($uid : ID, $city: String, $country : String, $weddingDate : String, $phoneNumber : String, $role : [String]) {
    createUser(uid: $uid, city : $city, country : $country, weddingDate : $weddingDate, phoneNumber : $phoneNumber, role: $role){
          city
          country
          weddingDate
          phoneNumber
          role
        }
      }`,
  getAllBusiness: `query ($criteria :searchCriteriaBusiness, $sort : sortCriteriaBusiness, $skip :Int, $limit : Int) {
        getAllBusinesses(searchCriteria:$criteria, sort: $sort, skip: $skip, limit: $limit){
          total
          results{
             _id
             city
            businessName
            slug
            content
            imgMiniatura{
              i1024
              i800
              i640
              i320
            }
            
          }
        }
      }`,
  getOneBusiness: `query ($id: ID, $slug : String) {
    getOneBusiness(_id: $id, slug: $slug){
      _id
      slug
      tags
      userUid
      contactName
      contactEmail
      businessName
      onLine{
        status
        dateConection
      }
      webPage
      landline
      mobilePhone
      whatsapp
      twitter
      facebook
      linkedin
      youtube
      instagram
      country
      city
      zip
      address
      description
      content
      review
    	reviewsT {
        total
        professionalism
        recommended
        priceQuality
        flexibility
      }
      subCategories{
        _id
      }
      questionsAndAnswers{
        questions{
          _id
          title
      }
        answers
    }
    imgLogo{
      _id
      i1024
      i800
      i640
      i320
    }
    imgMiniatura{
      _id
      i1024
      i800
      i640
      i320
    }
    }
}`,
  getUser: `query ($uid: ID) {
    getUser(uid:$uid){
      phoneNumber
      role
      typeRole
      city
      country
      weddingDate
      signUpProgress
      status
      createdAt
      updatedAt
    }
  }`,
  createBusiness: `mutation ($fase: String,
    $_id: ID,
    $userUid : ID,
    $contactName: String,
    $contactEmail : String,
    $mobilePhone : String,
    $businessName: String!,
    $country : String,
    $city: String,
    $webPage : String,
    $landline : String,
    $zip : String,
    $address : String,
    $description : String,
    $subCategories : [inputObjectID]
    $questionsAndAnswers : [inputQuestionsAndAnswers]
    $characteristics: [inputCharacteristicsCms]
    $coordinates : inputCoordinate
    $imgLogo : Upload
    $imgMiniatura : Upload
    $status : Boolean
    ) {
        createBusiness(
          fase : $fase,
          id: $_id,
          inputBusiness:{
            userUid : $userUid,
            contactName: $contactName,
            contactEmail: $contactEmail,
            mobilePhone: $mobilePhone,
            businessName: $businessName,
            country: $country,
            city: $city,
            zip: $zip,
            address: $address,
            description: $description,
            subCategories: $subCategories,
            questionsAndAnswers : $questionsAndAnswers
            characteristics : $characteristics
            webPage: $webPage
            landline: $landline
            coordinates: $coordinates
            imgLogo : $imgLogo
            imgMiniatura : $imgMiniatura
            status: $status
          }){
          _id,
          fase,
          imgMiniatura{
            i1024
            i800
            i640
            i320
          }
          imgLogo{
            i1024
            i800
            i640
            i320
          }
          questionsAndAnswers{
            questions{
              _id
              title
            }
            answers
          }
          characteristics{
            characteristic{
              _id
              title
              items{
                _id
                title
              }
            }
            
          }
        }
      }`,
  createReviews: `mutation ($args : inputReview){
    createReview(args:$args){
      _id
      business{
        _id
      }
      user{
        _id
      }
      average
      professionalism
      recommended
      priceQuality
      flexibility
      comment
      answer
      reference
      imgCarrusel{
          _id
          i1024
          i800
          i640
          i320
      }
      user{
          _id
          uid
          photoURL
          displayName
      }
    }
  }`,
  getCategories: `query {
    getCategoryBusiness{
      total
      results{
        _id
        title
        imgMiniatura{
          i1024
          i800
          i640
          i320
        }
        imgBanner{
          i1024
          i800
          i640
          i320
        }
        slug
        description
        subCategories{
          _id
          title
          imgMiniatura{
          i1024
          i800
          i640
          i320
        }
          slug
          description
        }
      }
    }
    }`,
  deleteImages: `mutation  ($idImage :ID, $idBusiness:ID, $use : String) {
    deleteUpload(_id:$idImage, businessID:$idBusiness, use:$use)
  }`,
  getHome: `query {
    getHome{
      business{
        _id
        slug
        description
        businessName
        content
        city
        imgMiniatura{
          i1024
          i800
          i640
          i320
        }
      }
      categoriesBusiness{
          title
          subCategories{
            _id
            title
            slug
            imgMiniatura{
              i1024
              i800
              i640
              i320
            }
          }
          slug
          imgMiniatura{
            i1024
            i800
            i640
            i320
          }
          icon{
            i1024
            i800
            i640
            i320
          }
      }
      post{
        _id
        title
        slug
        seoDescription
        content
        createdAt
        imgMiniatura{
          i1024
          i800
          i640
          i320
        }
      }
      categoriesPost{
        title
        imgMiniatura{
            i1024
            i800
            i640
            i320
        }
        subCategories{
          _id
          title
          slug
          imgMiniatura{
            i1024
            i800
            i640
            i320
          }
        }
        slug
      }
    }
  }`,
  getSlugBusiness: `query{
    getSlugBusiness
  }`,
  getSlugPosts: `query {
    getSlugPosts
  }`,
  getAllPost: `query ($criteria : searchCriteriaPost, $sort: sortCriteriaPost, $limit : Int, $skip : Int) {
    getAllPost(searchCriteria:$criteria, limit : $limit, skip: $skip, sort:$sort){
      total
      results{
        _id
        title
        subTitle
        content
        permaLink
        slug
        seoDescription
        categories{
          _id
          title
          imgMiniatura{
            i1024
            i800
            i640
            i320
            _id
          }
        }
        subCategories{
          _id
          title
          heading
          description
          imgBanner{
            _id
            i1024
            i800
            i640
            i320
          }
          imgMiniatura{
            _id
            i1024
            i800
            i640
            i320
          }
          icon{
            _id
            i1024
            i800
            i640
            i320
          }
        }
        tags
        imgCarrusel{
            _id
            i1024
            i800
            i640
            i320
          }
        imgMiniatura{
            _id
            i1024
            i800
            i640
            i320
          }
        authorUsername
        status
        createdAt
        updatedAt
      }
    }
  }`,
  getMagazine: `query {
    getMagazine{
      lastestPosts{
        _id
        content
        title
        slug
        categories{
          _id
          title
          heading
          description
          imgBanner{
            _id
            i640
            i800
            i320
            i1024
          }
          imgMiniatura{
            _id
            i640
            i800
            i320
            i1024
          }
        }
        updatedAt
        imgMiniatura{
            _id
            i640
            i800
            i320
            i1024
        }
      }
      postsByCategory{
        _id
        title
        seoDescription
        slug
        imgMiniatura{
          _id
          i1024
          i800
          i640
          i320
        }
      }
      postsMoreViews{
        _id
        title
        slug
        imgMiniatura{
          _id
          i1024
          i800
          i640
          i320
        }
      }
      categoriesPost{
        title
        slug
        _id
        heading
        icon{
          _id
          i320
        }
      }
    }
  }`,
  deleteBusiness: `mutation ($id : [ID]){
    deleteBusinesses(id: $id)
  }`,
  getAllCategoryBusiness: `query ($criteria : searchCriteriaCategory, $sort : sortCriteriaCategory, $skip : Int, $limit: Int) {
    getAllCategoryBusiness(searchCriteria: $criteria, sort: $sort, skip: $skip, limit: $limit){
      total
      results{
        _id
        title
        heading
        slug
        description
        imgBanner{
          i1024
          i800
          i640
          i320
        }
        subCategories{
          _id
          title
          heading
          slug
          description
          characteristics{
          title
          items{
            _id
            title
          }
        }
          imgMiniatura{
            i1024
            i800
            i640
            i320
          }
        }
      }
    }
  }`,
};

export const GraphQL = {
  // getPhotosBusinessByID: async (variables: any) => {
  //   const query = `query getBusiness($_id : ID){
  //     getBussines(id:$_id){
  //         _id,
  //         photos{
  //           _id
  //           mediumUrl
  //         }
  //       }
  //   }
  //   `;
  //   const {
  //     data: {
  //       data: { getBussines },
  //     },
  //   } = await api.graphql({ query, variables });
  //   return getBussines;
  // },

  uploadImage: async (file: any, id: string, use: string) => {
    const newFile = new FormData();
    const params = {
      query: `mutation ($file: Upload!, $businessID : String, $use : String) {
                singleUpload(file: $file, businessID:$businessID, use : $use){
                  _id
                  i1024
                  i800
                  i640
                  i320
                  createdAt
                }
              }
            `,
      variables: {
        file: null,
        businessID: id,
        use: use,
      },
    };

    let map = {
      0: ["variables.file"],
    };

    newFile.append("operations", JSON.stringify(params));
    newFile.append("map", JSON.stringify(map));
    newFile.append("0", file);

    const config = {
      onUploadProgress: (progressEvent: ProgressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
      },
    };

    const {
      data: {
        data: { singleUpload },
      },
    } = await api.graphql(newFile, config);
    return singleUpload;
  },
};
