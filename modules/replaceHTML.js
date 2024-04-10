module.exports = function(template, peoples) {
    let output = template.replace("{{%NAME%}}", peoples.name);
    output = output.replace("{{%LOCATION%}}", peoples.location);
    output = output.replace("{{%RULE%}}", peoples.Rule);
    output = output.replace("{{%ID%}}", peoples.id);
    output = output.replace("{{%IMAGE}}", peoples.image);
    output = output.replace("{{%ABOUT%}}", peoples.about);
  
    return output;
}