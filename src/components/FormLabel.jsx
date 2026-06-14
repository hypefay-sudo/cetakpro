import HelpTooltip from './HelpTooltip';
import { helpTexts } from '../data/helpTexts';

export default function FormLabel({ children, helpKey }) {
  return (
    <span className="field-label inline-flex items-center">
      {children}
      {helpKey ? <HelpTooltip text={helpTexts[helpKey]} /> : null}
    </span>
  );
}
