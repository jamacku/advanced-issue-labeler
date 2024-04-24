import { getInput, debug, info, setOutput } from '@actions/core';
import { context } from '@actions/github';
import { Config } from './config';
import { IssueForm } from './issue-form';
import { Labeler } from './labeler';
import { issueFormSchema } from './schema/input';
async function action(octokit) {
    var _a;
    const parsedIssueForm = issueFormSchema.safeParse(JSON.parse(getInput('issue-form', { required: true })));
    if (!parsedIssueForm.success) {
        throw new Error(`Incorrect format of provided 'issue-form' input: ${parsedIssueForm.error.message}`);
    }
    const issueForm = new IssueForm(parsedIssueForm.data);
    const config = await Config.getConfig(octokit);
    const labeler = new Labeler(issueForm, config);
    const labels = labeler.gatherLabels();
    setOutput('labels', JSON.stringify(labels !== null && labels !== void 0 ? labels : []));
    setOutput('policy', JSON.stringify(labeler.outputPolicy));
    // Check if there are some labels to be set
    if (!labels || (Array.isArray(labels) && (labels === null || labels === void 0 ? void 0 : labels.length) < 1)) {
        info('Nothing to do here. CY@');
        return;
    }
    info(`Labels to be set: ${labels}`);
    info(`Used policy: ${JSON.stringify(labeler.outputPolicy, null, 2)}`);
    const response = await octokit.graphql(`mutation AddLabels($issueId: ID!, $labelIds: [ID!]!) {
      addLabelsToLabelable(input: {labelableId: $issueId, labelIds: $labelIds}) {
        clientMutationId
      }
    }`, Object.assign({ issueId: (_a = context.payload.issue) === null || _a === void 0 ? void 0 : _a.node_id, labelIds: labels }, context.repo));
    debug(`GitHub API response status: [OK]`);
    debug(`GitHub API response data: ${JSON.stringify(response, null, 2)}`);
}
export default action;
//# sourceMappingURL=action.js.map