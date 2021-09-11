import User from "discourse/models/user";
import { escapeExpression } from "discourse/lib/utilities";
import getURL from "discourse-common/lib/get-url";
import { helperContext } from "discourse-common/lib/helpers";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-coloring-tag",

  initialize() {
    withPluginApi("0.8.18", (api) => {

      (settings.Tag_color || "").split("|").forEach(link => {
        let [tagID, backgroundColor, textColor] = (link || "").split(",");

        function testTagRenderer(tag, params) {

          // This file is in lib but it's used as a helper
          let siteSettings = helperContext().siteSettings;
        
          params = params || {};
          const visibleName = escapeExpression(tag);
          tag = visibleName.toLowerCase();
          if (tag == tagID) {
            var tagStyle = "background-color:" + backgroundColor + ";color:" + textColor
          }
          const classes = ["discourse-tag"];
          const tagName = params.tagName || "a";
          let path;
          if (tagName === "a" && !params.noHref) {
            if ((params.isPrivateMessage || params.pmOnly) && User.current()) {
              const username = params.tagsForUser
                ? params.tagsForUser
                : User.current().username;
              path = `/u/${username}/messages/tags/${tag}`;
            } else {
              path = `/tag/${tag}`;
            }
          }
          const href = path ? ` href='${getURL(path)}' ` : "";
        
          if (siteSettings.tag_style) {
            classes.push(siteSettings.tag_style);
          }
          if (params.size) {
            classes.push(params.size);
          }
        
          let val =
            "<" +
            tagName +
            href +
            " data-tag-name=" +
            tag +
            " style=" +
            tagStyle +
            " class='" +
            classes.join(" ") +
            "'>" +
            visibleName +
            "</" +
            tagName +
            ">";
        
          if (params.count) {
            val += " <span class='discourse-tag-count'>x" + params.count + "</span>";
          }
        
          return val;
        }
        
        api.replaceTagRenderer(testTagRenderer);
      })
    
    });
  },
};


