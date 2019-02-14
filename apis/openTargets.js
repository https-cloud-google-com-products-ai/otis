const axios = require("axios");

const PROTOCOL = "https";
const HOST = "api.opentargets.io";
const STEM = "v3/platform";
const ROOT = `${PROTOCOL}://${HOST}/${STEM}/`;

const disease = efoId => axios.get(`${ROOT}private/disease/${efoId}`);
const diseases = efoIds =>
  Promise.all([
    Promise.resolve(efoIds),
    axios.post(`${ROOT}private/disease`, { diseases: efoIds }),
  ]);
const target = ensgId => axios.get(`${ROOT}private/target/${ensgId}`);
const targets = ensgIds =>
  Promise.all([
    Promise.resolve(ensgIds),
    axios.post(`${ROOT}private/target`, { id: ensgIds }),
  ]);
const targetDrugs = (ensgId, next = null) =>
  next
    ? axios.get(
        `${ROOT}public/evidence/filter?size=1000&datasource=chembl&fields=disease.efo_info&fields=drug&fields=evidence&fields=target&fields=access_level&target=${ensgId}&expandefo=true&next=${
          next[0]
        }&next=${next[1]}`
      )
    : axios.get(
        `${ROOT}public/evidence/filter?size=1000&datasource=chembl&fields=disease.efo_info&fields=drug&fields=evidence&fields=target&fields=access_level&target=${ensgId}&expandefo=true`
      );
const targetsDrugsIteration = async (ensgIds, next = null) => {
  const props = {
    size: 10000,
    datasource: ["chembl"],
    fields: ["disease.efo_info", "drug", "evidence", "target", "access_level"],
    expandefo: true,
    target: ensgIds,
  };
  return next
    ? axios.post(`${ROOT}public/evidence/filter`, { ...props, next })
    : axios.post(`${ROOT}public/evidence/filter`, props);
};
async function targetsDrugsIterated(ensgIds) {
  const first = targetsDrugsIteration(ensgIds);
  let prev = await first;
  let rows = [];
  while (true) {
    const next = prev ? prev.data.next : null;
    rows = [...rows, ...prev.data.data];
    if (next) {
      prev = await targetsDrugsIteration(ensgIds, next);
    } else {
      break;
    }
  }
  return rows;
}
const targetsDrugs = ensgIds =>
  Promise.all([Promise.resolve(ensgIds), targetsDrugsIterated(ensgIds)]);

async function targetDrugsIterated(ensgId) {
  const first = axios.get(
    `${ROOT}public/evidence/filter?size=1000&datasource=chembl&fields=disease.efo_info&fields=drug&fields=evidence&fields=target&fields=access_level&target=${ensgId}&expandefo=true`
  );
  let prev = await first;
  let rows = [];
  while (true) {
    const next = prev ? prev.data.next : null;
    rows = [...rows, ...prev.data.data];
    if (next) {
      prev = await axios.get(
        `${ROOT}public/evidence/filter?size=1000&datasource=chembl&fields=disease.efo_info&fields=drug&fields=evidence&fields=target&fields=access_level&target=${ensgId}&expandefo=true&next=${
          next[0]
        }&next=${next[1]}`
      );
    } else {
      break;
    }
  }
  return rows;
}

const targetSimilar = ensgId =>
  axios.get(`${ROOT}private/relation/target/${ensgId}?id=${ensgId}&size=10000`);
const targetAssociations = ensgId =>
  axios.post(`${ROOT}public/association/filter`, {
    target: [ensgId],
    facets: false,
    direct: true,
    size: 10000,
    sort: ["association_score.overall"],
    search: "",
    draw: 2,
  });
const targetAssociationsFacets = ensgId =>
  axios.get(
    `${ROOT}public/association/filter?target=${ensgId}&outputstructure=flat&facets=true&direct=true&size=1`
  );
const targetExpression = ensgId =>
  axios.get(`${ROOT}private/target/expression?gene=${ensgId}`);

module.exports = {
  targetAssociations,
  targetExpression,
};
