const data = require("./input.json");
const fs = require("fs");

const slug = function(string) {
  let slug = string.toLowerCase();
  //Đổi ký tự có dấu thành không dấu
  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a");
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e");
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, "i");
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o");
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u");
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y");
  slug = slug.replace(/đ/gi, "d");
  //Xóa các ký tự đặt biệt
  slug = slug.replace(
    /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
    ""
  );
  //Đổi khoảng trắng thành ký tự gạch ngang
  slug = slug.replace(/ /gi, "-");
  //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
  //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
  slug = slug.replace(/\-\-\-\-\-/gi, "-");
  slug = slug.replace(/\-\-\-\-/gi, "-");
  slug = slug.replace(/\-\-\-/gi, "-");
  slug = slug.replace(/\-\-/gi, "-");
  //Xóa các ký tự gạch ngang ở đầu và cuối
  slug = "@" + slug + "@";
  slug = slug.replace(/\@\-|\-\@|\@/gi, "");
  return slug;
};

let listProvince = [];
let listDistricts = [];
let listWards = [];

function isExistProvince(province) {
  listResult;
  return listProvince.includes(province);
}
function isExistDistricts(districts) {
  return listDistricts.includes(districts);
}
function isExistWards(wards) {
  return listWards.includes(wards);
}

let province = {
  name: "",
  slug: "",
  is_activied: false,
  districts: []
};

let districts = {
  name: "",
  slug: "",
  is_activied: false,
  wards: []
};

let wards = {
  name: "",
  slug: "",
  is_activied: false
};

let listResult = [];

function findIndexProvine(provinceName) {
  return listResult.findIndex(el => el.name == provinceName);
}

function findIndexDistricts(listDistrit, districtsName) {
  return listDistrit.findIndex(el => el.name == districtsName);
}

for (let i = 0; i < data.length; i++) {
  let element = data[i];
  if (!isExistProvince(element["Mã TP"])) {
    let province = {
      name: "",
      slug: "",
      is_activied: false,
      districts: []
    };

    let districts = {
      name: "",
      slug: "",
      is_activied: false,
      wards: []
    };

    let wards = {
      name: "",
      slug: "",
      is_activied: false
    };
    wards.name = element["Tên"];
    wards.slug = slug(element["Tên"]);
    districts.name = element["Quận Huyện"];
    districts.slug = slug(element["Quận Huyện"]);
    districts.wards = [wards];

    province.name = element["Tỉnh / Thành Phố"];
    province.slug = slug(element["Tỉnh / Thành Phố"]);
    province.districts = [districts];

    listResult.push(province);

    listProvince.push(element["Mã TP"]);
    listDistricts.push(element["Mã QH"]);
    listWards.push(element["Mã"]);
  } else {
    if (!isExistDistricts(element["Mã QH"])) {
      let indexProvince = findIndexProvine(element["Tỉnh / Thành Phố"]);
      let districts = {
        name: "",
        slug: "",
        is_activied: false,
        wards: []
      };

      let wards = {
        name: "",
        slug: "",
        is_activied: false
      };

      wards.name = element["Tên"];
      wards.slug = slug(element["Tên"]);
      districts.name = element["Quận Huyện"];
      districts.slug = slug(element["Quận Huyện"]);

      let newListWards = [...districts.wards, wards];
      districts.wards = newListWards;

      let newListDistricts = [
        ...listResult[indexProvince].districts,
        districts
      ];

      listResult[indexProvince].districts = newListDistricts;

      listDistricts.push(element["Mã QH"]);
      listWards.push(element["Mã"]);
    } else {
      if (!isExistWards(element["Mã"])) {
        let wards = {
          name: "",
          slug: "",
          is_activied: false
        };
        let indexProvince = findIndexProvine(element["Tỉnh / Thành Phố"]);

        let indexDistricts = findIndexDistricts(
          listResult[indexProvince].districts,
          element["Quận Huyện"]
        );

        wards.name = element["Tên"];
        wards.slug = slug(element["Tên"]);
        let newListWards = [
          ...listResult[indexProvince].districts[indexDistricts].wards,
          wards
        ];

        listResult[indexProvince].districts[
          indexDistricts
        ].wards = newListWards;
        listWards.push(element["Mã"]);
      }
    }
  }
}

fs.writeFile(
  "output.json",
  JSON.stringify(listResult, null, 4),
  "utf8",
  function(err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  }
);
