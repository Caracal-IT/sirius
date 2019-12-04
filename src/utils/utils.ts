
export function format(first: string, middle: string, last: string): string {
  return (
    (first || '') +
    (middle ? ` ${middle}` : '') +
    (last ? ` ${last}` : '')
  );
}

export const wf = {
  name: "Workflow1",
  activities: [
    {
      name: "start",
      components: [
        { tag: 'polaris-label' },
        { tag: 'polaris-select', id: 'registration.numberSelect' },
        { tag: 'polaris-select', id: 'registration.numberSelect2' },       
        { tag: 'input', id: 'registration.firstName' },
        { tag: 'polaris-button', id:'nextButton', caption:'Next', next: 'page1'}
      ]    
    },
    {
      name: "page1",
      components: [                        
        { tag: 'input', id: 'registration.firstName' },
        { tag: 'input', id: 'registration.lastName' },
        { tag: 'polaris-button', id:'nextButton', caption:'Previous', next: 'start'}
      ]    
    }
  ]
};