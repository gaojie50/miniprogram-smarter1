import reqPacking from '../../../utils/reqPacking.js';

export function Search(projectId) {
  return new Promise((resolve, reject) => {
    reqPacking({
      url: 'api/management/movie/search',
      data: {
        projectId,
      }
    }).then(res => {
      const { success, data = {}, error } = res;
      if(success) {
        resolve(data)
      } else {
        reject(error)
      }
    })
  })
}

export function projectSearch(projectId) {
  return new Promise((resolve, reject) => {
    reqPacking({
      url: 'api/management/projectInfo',
      data: {
        projectId,
      }
    }).then(res => {
      const { success, data = {}, error } = res;
      if(success) {
        resolve(data)
      } else {
        reject(error)
      }
    })
  })
}

export function searchRole(projectId) {
  return new Promise((resolve, reject) => {
    reqPacking({
      url: 'api/management/judgeRole',
      data: { 
        projectId,
      }
    }).then(res => {
        const { success, data = {}, error } = res;
        if(success) {
          resolve(data)
        } else {
          reject(error)
        }
    })
  })
}