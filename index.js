var xml = require('xml');
var pd = require('pretty-data').pd;

//importe les variables de url-json.js
var url_from_json = require("./url-json.js");
// console.log("\n", url_from_json.zones_livraison.selected_cities);
// console.log("\n\n", url_from_json.images_urls);

/**
 * ajoute une image a une url générée par append_url()
**/
function append_image(url, test, image_url, image_caption) {
  let image = [];
  let loc = image_url;
  let caption = image_caption;
  //let title = image_title;

  image.push({'image:loc':loc});
  image.push({'image:caption':caption});
  //image.push({'image:title':title});
  //let url = append_url(test, 'https://demo-wokandgo-3.shoppyfood.com/sitemap4.xml', 0.8, 'weekly', '2017-08-24T12:55:46+02:00');
  url.push({'image:image':image});
  //test[0].urlset.push({url:[{'image:image':image}]});
  //test[0].urlset.push({'image:image':image});
}

/**
 * ajoute une video a une url générée par append_url()
**/
function append_video(url, test, video_url, video_caption, video_thumbnail, video_title, video_description, video_content) {
  let video = [];
  let loc = video_url;
  let caption = video_caption;
  let thumbnail_loc = video_thumbnail;
  let title = video_title;
  let description = video_description;
  let content_loc = video_content;

  video.push({'video:loc':loc});
  video.push({'video:caption':caption});
  video.push({'video:thumbnail_loc':thumbnail_loc});
  /*video.push({'video:title':title});
  video.push({'video:description':description});
  video.push({'video:content_loc':content_loc});*/
  url.push({'video:video':video});
  //test[0].urlset.push({url:[{'video:video':video}]});
}

/**
 * pour les sitemaps
**/
function append_url(test, url_link, changefreq, priority, lastmod) {
  let url = [];
  let loc = url_link;

  url.push({loc});
  url.push({changefreq});
  url.push({priority});
  url.push({lastmod});

  test[0].urlset.push({url});

  return url;
}
function generate_sitemap(url_details, array_of_objects, type, urls_images) {
  var test = [
    {
      urlset:
      [
        { _attr: { 'xmlns':"http://www.sitemaps.org/schemas/sitemap/0.9", "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance", "xmlns:image":"http://www.google.com/schemas/sitemap-image/1.1", "xmlns:video":"http://www.google.com/schemas/sitemap-video/1.1"}},//
        //, "xsi:schemaLocation":"http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd",
      ]
    }
  ]

  var date = new Date().toISOString();
  let website_url = 'https://demo-wokandgo-3.shoppyfood.com/';

  for (var i = 0; i < array_of_objects.length; i++) {
    for (var j = 0; j < type.length; j++) {
      let url = append_url(test, website_url + url_details+ "/" + array_of_objects[i].name + "/" + type[j], 0.8, 'weekly', date);
      if(type.length > 1) {
         append_image(url, test, website_url + url_details + "/" + array_of_objects[i].name + "/" + type[j] + "/" +urls_images[j], type[j]);
         append_video(url, test, "", "", "", "", "", "");
      }
    }
    // console.log(url);
  }

  let xmlString = xml(test, { declaration: true });
  // console.log(xmlString);

  return xmlString;
}

/**
 * pour l'index sitemap regroupant les sitemaps
**/
function append_sitemap(test, url_link, lastmod) {
  let sitemap = [];
  let loc = url_link;
  sitemap.push({loc});
  sitemap.push({lastmod});

  test[0].sitemapindex.push({sitemap});
}
function generate_sitemap_index(array_of_sitemaps) {
  var test = [
    {
      sitemapindex:
      [
        { _attr: { 'xmlns':"http://www.sitemaps.org/schemas/sitemap/0.9", "xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance" } },//http://www.google.com/schemas/sitemap-video/1.1
        // "xsi:schemaLocation":"http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd",
      ]
    }
  ]
  var date = new Date().toISOString();

  website_url = 'https://demo-wokandgo-3.shoppyfood.com/';
  for (let i = 0; i < array_of_sitemaps.length; i++) {
    append_sitemap(test, website_url + array_of_sitemaps[i], date);
  }

  let xmlString = xml(test, { declaration: true });
  //console.log(xmlString);

  return xmlString;
}

// l'index
// let xml_ = generate_sitemap_index(['sitemap_zones_de_livraison.xml', 'sitemap_produits.xml', 'sitemap_autre.xml']);
// let xml_pp = pd.xml(xml_);
// console.log("\nsitemapindex :\n",xml_pp);
// console.log("\n");

// les sitemaps
// appel sur les zones de livraisons
// let xml2 = generate_sitemap('restaurants-livraison-a-domicile/zone-livraison', url_from_json.zones_livraison.selected_cities, " ", "");

// appel sur les produits
let xml2 = generate_sitemap('restaurants-livraison-a-domicile/zone-livraison', url_from_json.zones_livraison.selected_cities, url_from_json.products_urls, url_from_json.images_urls);
let xml_pp2 = pd.xml(xml2);
console.log("\nsitemap :\n",xml_pp2);

// exports.handler = (event, context, callback) => {
//   // TODO implement
//
//   // l'index
//   // let xml_ = generate_sitemap_index(['sitemap_zones_de_livraison.xml', 'sitemap_produits.xml', 'sitemap_autre.xml']);
//   // let xml_pp = pd.xml(xml_);
//   // console.log("\nsitemapindex :\n",xml_pp);
//   // console.log("\n");
//
//   // les sitemaps
//   // appel sur les zones de livraisons
//   // let xml2 = generate_sitemap('restaurants-livraison-a-domicile/zone-livraison', url_from_json.zones_livraison.selected_cities, " ", "");
//
//   // appel sur les produits
//   let xml2 = generate_sitemap('restaurants-livraison-a-domicile/zone-livraison', url_from_json.zones_livraison.selected_cities, url_from_json.products_urls, url_from_json.images_urls);
//   let xml_pp2 = pd.xml(xml2);
//   console.log("\nsitemap :\n",xml_pp2);
//
//   callback(null, xml_pp2);
//};
