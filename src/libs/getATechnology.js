import getTechnologies from "./getTechnologies";

const getATechnology = (slug) => {
  const technologies = getTechnologies();
  const technology = technologies?.find((item) => item.slug === slug);
  return technology || {};
};

export default getATechnology;
