interface ModelBase<Tid = number, Tcreated = Date, Tupdated = Date> {
  id: Tid;
  createdAt: Tcreated;
  updatedAt: Tupdated;
}

export default ModelBase;
