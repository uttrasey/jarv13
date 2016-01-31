/**
 * When rendering server side view, we need we a way to make sure that the store
 * has finished processing all async actions so that view render has what it needs
 * in advance.
 */
export default function fetchComponentData(dispatch, components, params) {
  const needs = components.reduce((prev, current) => {
    return (current.needs || [])
      .concat((current.WrappedComponent ? current.WrappedComponent.needs : []) || [])
      .concat(prev);
    }, []);

    const promises = needs.map(need => dispatch(need(params)));
    return Promise.all(promises);
}
