const url = "http://localhost:8000";

export class CookService {
  async getRecipe(id) {
    return fetch(`${url}/recipe/${id}`).then((res) => res.json());
  }

  async forceDeleteCategory(id) {
    return fetch(`${url}/categories/${id}?force=true`, {
      method: "DELETE",
    }).then((res) => res.json());
  }

  async postCategory(req) {
    return fetch(`${url}/categories`, req).then((res) => res.json());
  }

  async getChampionships() {
    return fetch(`${url}/championships`).then((res) => res.json());
  }

  async getChampionship(id) {
    return fetch(`${url}/championships/${id}`).then((res) => res.json());
  }

  async deleteChampionship(id) {
    return fetch(`${url}/championships/${id}`, { method: "DELETE" }).then(
      (res) => res.json()
    );
  }
  async forceDeleteChampionship(id) {
    return fetch(`${url}/championships/${id}?force=true`, {
      method: "DELETE",
    }).then((res) => res.json());
  }

  async postChampionship(req) {
    return fetch(`${url}/championships`, req).then((res) => res.json());
  }

  async getSponsors() {
    return fetch(`${url}/sponsors`).then((res) => res.json());
  }

  async getSponsor(id) {
    return fetch(`${url}/sponsors/${id}`).then((res) => res.json());
  }

  async getSponsorsGroup() {
    return fetch(`${url}/sponsors/groups`).then((res) => res.json());
  }

  async deleteSponsor(id) {
    return fetch(`${url}/sponsors/${id}`, { method: "DELETE" }).then((res) =>
      res.json()
    );
  }
  async forceDeleteSponsor(id) {
    return fetch(`${url}/sponsors/${id}?force=true`, {
      method: "DELETE",
    }).then((res) => res.json());
  }

  async postSponsor(req) {
    return fetch(`${url}/sponsors`, req).then((res) => res.json());
  }

  async postEvent(req) {
    return fetch(`${url}/events`, req).then((res) => res.json());
  }

  async getEvents() {
    return fetch(`${url}/events`).then((res) => res.json());
  }

  async getEventsList() {
    return fetch(`${url}/events/list`).then((res) => res.json());
  }

  async getNextEvents(sid) {
    console.log(sid);
    return fetch(`${url}/events/next?sid=${sid}`).then((res) => res.json());
  }

  async getEvent(id) {
    return fetch(`${url}/events/${id}`).then((res) => res.json());
  }

  async deleteEvent(id) {
    return fetch(`${url}/events/${id}`, { method: "DELETE" }).then((res) =>
      res.json()
    );
  }
  async forceDeleteEvent(id) {
    return fetch(`${url}/events/${id}?force=true`, {
      method: "DELETE",
    }).then((res) => res.json());
  }

  async getTeams() {
    return fetch(`${url}/teams`).then((res) => res.json());
  }

  async getTeam(id) {
    return fetch(`${url}/teams/${id}`).then((res) => res.json());
  }

  async deleteTeam(id) {
    return fetch(`${url}/teams/${id}`, { method: "DELETE" }).then((res) =>
      res.json()
    );
  }
  async forceDeleteTeam(id) {
    return fetch(`${url}/teams/${id}?force=true`, {
      method: "DELETE",
    }).then((res) => res.json());
  }

  async postTeam(req) {
    return fetch(`${url}/teams`, req).then((res) => res.json());
  }

  async uploadImgFile(data) {
    const formData = new FormData();
    formData.append("prev_file", data.name);
    formData.append("file", data);
    return fetch(`${url}/filex/img`, {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
  }

  // async getImgFile(data) {
  //   return await fetch(`${url}/filex?target=${data}`).then((res) => res.json());
  // }
  static getRecipes() {
    return fetch(`${url}/recipe`).then((res) => res.json());
  }

  static deleteRecipe(id) {
    return fetch(`${url}/recipe/${id}`, { method: "DELETE" }).then(
      (res) => res.status
    );
  }

  static getIngredients() {
    return fetch(`${url}/ingredient`).then((res) => res.json());
  }

  static deleteIngredient(id) {
    return fetch(`${url}/ingredient/${id}`, { method: "DELETE" }).then(
      (res) => res.status
    );
  }

  static postIngredient(values) {
    return fetch(`${url}/ingredient`, {
      method: "POST",
      body: JSON.stringify(values, null, 2),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => res);
  }

  static putIngredient(values) {
    return fetch(`${url}/ingredient/${values.id}`, {
      method: "PUT",
      body: JSON.stringify(values, null, 2),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => res);
  }
}
