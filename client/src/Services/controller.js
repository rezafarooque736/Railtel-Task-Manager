export const selectedEmployeeForTask = tasks => {
  return tasks.map(ele => [ele.EmpName, ele.EmpPhoto, ele.EmpEmailId]);
};
