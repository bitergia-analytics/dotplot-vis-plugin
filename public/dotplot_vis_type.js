/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * Bitergia requires contributions made to this file be 
 * licensed under the Apache-2.0 license or a compatible
 * open source license.
 *
 * Any modifications Copyright Bitergia.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { i18n } from '@osd/i18n';
import { AggGroupNames } from '../../../src/plugins/data/public';
import { Schemas } from '../../../src/plugins/vis_default_editor/public';

import { dotplotVisRequestHandler } from './data_load/dotplot_vis_request_handler';
import { dotplotVisResponseHandler } from './data_load/dotplot_vis_response_handler';
import { DotplotOptions } from './components/dotplot_vis_options_lazy';
import { DotplotVisComponent } from './components/dotplot_vis_component';
import { VIS_EVENT_TO_TRIGGER } from '../../../src/plugins/visualizations/public';
import './index.scss'
import image from './images/icon-dots.svg';

// define the visType object, which kibana will use to display and configure new Vis object of this type.
export function getDotplotVisTypeDefinition() {
  return {
    type: 'dotplot',
    name: 'kbn_dotplot',
    title: i18n.translate('visTypeDotplot.visTitle', {
      defaultMessage: 'Dotplot'
    }),
    icon: image,
    description: i18n.translate('visTypeDotplot.visDescription', {
      defaultMessage: 'Visualize dot with metrics in both axis'
    }),
    getSupportedTriggers: () => {
      return [VIS_EVENT_TO_TRIGGER.filter];
    },
    visConfig: {
      component: DotplotVisComponent
    },
    editorConfig: {
      optionsTemplate: DotplotOptions,
      schemas: new Schemas([
        {
          group: AggGroupNames.Metrics,
          name: 'x-axis',
          title: 'X-Axis',
          aggFilter: ['!geo_centroid', '!geo_bounds'],
          aggSettings: {
            top_hits: {
              allowStrings: false
            }
          },
          max: 1,
          defaults: [{ type: 'count', schema: 'x-axis' }]
        },
        {
          group: AggGroupNames.Metrics,
          name: 'y-axis',
          title: 'Y-Axis',
          aggFilter: ['!geo_centroid', '!geo_bounds'],
          aggSettings: {
            top_hits: {
              allowStrings: false
            }
          },
          max: 1,
          defaults: [{ type: 'count', schema: 'y-axis' }]
        },
        {
          group: AggGroupNames.Metrics,
          name: 'dotsize',
          title: 'Dot Size',
          aggFilter: ['!geo_centroid', '!geo_bounds'],
          aggSettings: {
            top_hits: {
              allowStrings: false
            }
          },
          max: 1,
        },
        {
          group: AggGroupNames.Buckets,
          name: 'field',
          title: "Field",
          min: 1,
          max: 2,
          aggFilter: ['terms', 'filters']
        }
      ])
    },
    implementsRenderComplete: true,
    requestHandler: dotplotVisRequestHandler,
    responseHandler: dotplotVisResponseHandler,
    hierarchicalData: (vis) => {
      return true;
    }
  };
}
