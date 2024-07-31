import { minBy } from 'lodash';

const SNAP_THRESHOLD = 5;

function getLineGuides(that, ignoredNode) {
  const ret = {
    vertical: [],
    horizontal: []
  };
  if (!that.stage) {
    return ret;
  }

  const stageWidth = that.stage.width(),
    stageHeight = that.stage.height();
  [].push.call(ret.vertical, 0, stageWidth / 2, stageWidth);
  [].push.call(ret.horizontal, 0, stageHeight / 2, stageHeight);

  that.stage.find('.element').forEach(item => {
    if (item === ignoredNode) {
      return;
    }
    const box = item.getClientRect();
    [].push.call(ret.vertical, box.x, box.x + box.width / 2, box.x + box.width);
    [].push.call(ret.horizontal, box.y, box.y + box.height / 2, box.y + box.height);
  });

  return ret;
}

function getItemBounds(that, node) {
  const ret = {
    vertical: [],
    horizontal: []
  };
  if (!that.stage) {
    return ret;
  }

  const box = node.getClientRect();
  const absPos = node.absolutePosition();

  [].push.call(
    ret.vertical,
    {
      guide: Math.round(box.x),
      offset: Math.round(absPos.x - box.x),
      snap: 'start'
    },
    {
      guide: Math.round(box.x + box.width / 2),
      offset: Math.round(absPos.x - box.x - box.width / 2),
      snap: 'center'
    },
    {
      guide: Math.round(box.x + box.width),
      offset: Math.round(absPos.x - box.x - box.width),
      snap: 'end'
    }
  );
  [].push.call(
    ret.horizontal,
    {
      guide: Math.round(box.y),
      offset: Math.round(absPos.y - box.y),
      snap: 'start'
    },
    {
      guide: Math.round(box.y + box.height / 2),
      offset: Math.round(absPos.y - box.y - box.height / 2),
      snap: 'center'
    },
    {
      guide: Math.round(box.y + box.height),
      offset: Math.round(absPos.y - box.y - box.height),
      snap: 'end'
    }
  );
  return ret;
}

export function getGuides(possibleSnapLines, itemBounds) {
  const getAllSnapLines = direction => {
    const result = [];
    possibleSnapLines[direction].forEach(lineGuide => {
      itemBounds[direction].forEach(itemBound => {
        const diff = Math.abs(lineGuide - itemBound.guide);
        if (diff > SNAP_THRESHOLD) return;
        const { snap, offset } = itemBound;
        result.push({ lineGuide, diff, snap, offset });
      });
    });
    return result;
  };

  const resultV = getAllSnapLines('vertical');
  const resultH = getAllSnapLines('horizontal');

  const closestSnapLines = [];
  const getSnapLine = ({ lineGuide, offset, snap }, orientation) => {
    return { lineGuide, offset, snap, orientation };
  };

  const minV = minBy(resultV, 'diff');
  const minH = minBy(resultH, 'diff');

  if (minV) closestSnapLines.push(getSnapLine(minV, 'V'));
  if (minH) closestSnapLines.push(getSnapLine(minH, 'H'));

  return closestSnapLines;
}

export function getDrawLines(lines = [], ratio) {
  if (!lines.length) return { hLines: [], vLines: [] };
  const lineStyle = {
    stroke: 'rgb(0, 161, 255)',
    strokeWidth: 1 / ratio,
    name: 'guideline',
    dash: [4 / ratio, 6 / ratio]
  };
  const hLines = [],
    vLines = [];
  lines.forEach(line => {
    const { orientation, lineGuide } = line;
    const realLineGuide = lineGuide / ratio;
    if (orientation === 'H') {
      hLines.push({
        points: [-6000, 0, 6000, 0],
        x: 0,
        y: realLineGuide,
        ...lineStyle
      });
    } else if (orientation === 'V') {
      vLines.push({
        points: [0, -6000, 0, 6000],
        x: realLineGuide,
        y: 0,
        ...lineStyle
      });
    }
  });
  return { hLines, vLines };
}

export function onSnapGuideLine(that, node, isUseSnap = true) {
  const { ratio } = that.props;
  const lindeGuides = getLineGuides(that, node);
  const itemBounds = getItemBounds(that, node);
  const guides = getGuides(lindeGuides, itemBounds);
  const { hLines, vLines } = getDrawLines(guides, ratio);

  // 绘制的guidelines
  that.setState({ hLines, vLines });

  // 吸附实现
  if (isUseSnap) {
    const absPos = node.absolutePosition();
    guides.forEach(line => {
      const { lineGuide, offset, orientation } = line;
      const position = lineGuide + offset;
      if (orientation === 'V') {
        absPos.x = position;
      } else if (orientation === 'H') {
        absPos.y = position;
      }
    });
    node.absolutePosition(absPos);
  }
}
