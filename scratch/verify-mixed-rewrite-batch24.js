const fs = require('fs');
const matter = require('gray-matter');
const files = [
  ['tekla-structures','tekla-structures-drawing-opening-slow-model-view-performance-ifc-export-uda-inheritance-component-nesting-crash-storing-modifying-large-object-slowness-advanced-options-tuning-model-history-graphics-driver-service-pack-fixes'],
  ['tekla-tedds','tekla-tedds-addin-disabled-error-287-word-instance-failed-vbl-variable-file-out-of-sync-library-access-system-memory-errors-calculation-fatal-error-word-addin-reenable-office-reinstall-vbl-file-deletion-recalculation-memory-management'],
  ['think3','thinkdesign-step-file-internal-error-iges-missing-spheres-solid-shells-inverted-normals-gbg-raster-file-never-ending-process-d-shared-groups-import-issues-2024-sp2-fixes-tdxchange-converter-neutral-format-best-practices'],
  ['tinkercad','tinkercad-shape-generator-failed-to-build-design-page-not-loading-stl-export-non-manifold-boolean-ghost-artifacts-svg-import-version-mismatch-browser-compatibility-overlap-prevention-double-group-svg-1-0-format-fix'],
  ['topsolid','topsolid-pdm-server-startup-bug-error-in-nesting-redistributable-pdm-database-recovery-sql-mdf-ldf-service-pack-crash-username-disappeared-pdm-sql-database-attach-redistributable-reinstall-repair-installation-pdm-user-re-registration'],
];
const req = ['title','excerpt','category','softwareSlug','keyword','slug','author','readTime','date','sources'];
for (const [t, s] of files) {
  const f = `f:/cadguide.tools/src/content/guides/${t}/${s}.md`;
  const { data } = matter(fs.readFileSync(f, 'utf-8'));
  const miss = req.filter(k => !data[k]);
  console.log(s.substring(0,60) + ' | cat:' + data.category + ' | src:' + data.sources.length + ' | miss:' + (miss.length ? miss.join(',') : 'none'));
}
