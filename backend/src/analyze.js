const analyzeCss = (parsedCss, tokens, componentConfigs) => {
  let report = {
    components: {},
  };

  // Estrarre i componenti e verificare i tokens
  parsedCss.stylesheet.rules.forEach(rule => {
    if (rule.type === 'rule') {
      rule.selectors.forEach(selector => {
        const componentName = getComponentNameFromSelector(selector, componentConfigs);
        if (componentName) {
          if (!report.components[componentName]) {
            report.components[componentName] = {
              used: [],
              missing: [],
              incorrect: [],
            };
          }

          rule.declarations.forEach(declaration => {
            const token = tokens.components[componentName]?.tokens.find(token => token.name === declaration.property);
            if (token) {
              if (token.value === declaration.value) {
                report.components[componentName].used.push(token);
              } else {
                report.components[componentName].incorrect.push({ token, actualValue: declaration.value });
              }
            } else {
              report.components[componentName].missing.push({ name: declaration.property, value: declaration.value });
            }
          });
        }
      });
    }
  });

  return report;
};

const getComponentNameFromSelector = (selector, componentConfigs) => {
  const config = componentConfigs.find(config => selector.startsWith(config.selector));
  return config ? config.component : null;
};

module.exports = { analyzeCss };
