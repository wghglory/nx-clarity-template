/**
 * After a behavior invocation, response header LOCATION url will return a task model.
 * It is the subset of vcd task model
 */
export interface VcdTask {
  status: 'queued' | 'running' | 'success' | 'error';
  details: string; // if status is error, read details as error message
  result: {
    resultContent: string; // if status is success, may get resultContent
    resultReference: any;
  } | null;
  href: string;
  id: string;
  description?: any;
  name: string;
  owner: {
    href: string;
    id: string;
    type: string;
    name: string;
  };
  progress?: any;
  operation: string;
}
